import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
rng=np.random.default_rng(7)
cut=np.array(Image.open('leijie_cut.png').convert('RGBA').resize((768,1024),Image.LANCZOS)).astype(np.float32)/255
orig=cut[...,:3]; A=cut[...,3]
# square crop head+shoulders
y0,S,x0=40,740,14
orig=orig[y0:y0+S,x0:x0+S]; A=A[y0:y0+S,x0:x0+S]
N=900
orig=cv2.resize(orig,(N,N),interpolation=cv2.INTER_AREA); A=cv2.resize(A,(N,N))
bgr=(orig[...,::-1]*255).astype(np.uint8)
smooth=cv2.edgePreservingFilter(bgr,flags=1,sigma_s=40,sigma_r=0.35)
g=cv2.cvtColor(smooth,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
# ink tones: compress lights to paper, deepen darks, soft posterize
t=np.clip((g-0.12)/0.75,0,1)
levels=np.array([0.0,0.32,0.62,0.86,1.0])
q=np.interp(t,[0,0.18,0.42,0.7,1],levels)
w=np.clip((0.55-t)/0.3,0,1)
tone=w*(0.6*q+0.4*t)+(1-w)*np.clip(0.55+0.6*(t-0.5)+0.25,0,1)
tone=np.clip(tone*1.08+0.04,0,1)
# ink lines (DoG) for features
gg=cv2.cvtColor(bgr,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
dog=cv2.GaussianBlur(gg,(0,0),1.2)-cv2.GaussianBlur(gg,(0,0),3.0)
lines=np.clip(1-np.maximum(0,-dog-0.006)*11,0,1)
lines=cv2.GaussianBlur(lines,(0,0),0.6)
tone=tone*(0.35+0.65*lines)
# ink bleed on darks: wobble + blur
dark=1-tone
nx=cv2.GaussianBlur(rng.normal(0,1,(N,N)).astype(np.float32),(0,0),6)*6
ny=cv2.GaussianBlur(rng.normal(0,1,(N,N)).astype(np.float32),(0,0),6)*6
mx,my=np.meshgrid(np.arange(N),np.arange(N))
bleed=cv2.remap(cv2.GaussianBlur(dark,(0,0),2.5),(mx+nx).astype(np.float32),(my+ny).astype(np.float32),cv2.INTER_LINEAR)
dark=np.maximum(dark,bleed*0.85)
# granulation
gran=cv2.GaussianBlur(rng.normal(0,1,(N,N)).astype(np.float32),(0,0),1.0)
dark=np.clip(dark*(1+0.12*gran),0,1)
# fade body out at bottom like brush wash
fy=np.clip((N*1.02-my)/(N*0.16),0,1)**1.2
alpha=np.clip(A,0,1)*fy
alpha=cv2.GaussianBlur(alpha,(0,0),2)
ink=np.array([0.10,0.11,0.12])
paper=np.array([0.965,0.949,0.914])
por=paper[None,None,:]*(1-dark[...,None])+ink[None,None,:]*dark[...,None]
# spot color: lips and earrings
mx,my=np.meshgrid(np.arange(N),np.arange(N))
hsv=cv2.cvtColor(bgr,cv2.COLOR_BGR2HSV).astype(np.float32)
H,Sa,V=hsv[...,0],hsv[...,1]/255,hsv[...,2]/255
lips=((H<10)|(H>165))&(Sa>0.22)&(V>0.3)
box=np.zeros((N,N),bool); box[578-40:578+40,466-85:466+85]=True; lips&=box
med=np.median(Sa[box]); lips&=(Sa>med+0.08)
gold=(H>12)&(H<32)&(Sa>0.35)&(V>0.45)&(my>380)&(my<640)&((mx<300)|(mx>620))
lips=cv2.morphologyEx(lips.astype(np.uint8),cv2.MORPH_OPEN,np.ones((3,3),np.uint8)).astype(bool)
lm=cv2.GaussianBlur(lips.astype(np.float32),(0,0),2.5)
gm=cv2.GaussianBlur(gold.astype(np.float32),(0,0),1.5)
por=por*(1-0.55*lm[...,None])+np.array([0.80,0.42,0.40])*0.55*lm[...,None]
por=por*(1-0.7*gm[...,None])+np.array([0.78,0.60,0.30])*0.7*gm[...,None]
# cheeks blush
cy,cx=int(N*0.47),int(N*0.5)
blush=np.zeros((N,N),np.float32)
for dx in (-0.16,0.16):
    cv2.circle(blush,(int(cx+dx*N),int(cy+0.07*N)),int(N*0.05),1,-1)
blush=cv2.GaussianBlur(blush,(0,0),N*0.03)*A
por=por*(1-0.18*blush[...,None])+np.array([0.92,0.6,0.58])*0.18*blush[...,None]
# canvas
C=1024; R=478
canvas=np.zeros((C,C,4),np.float32)
yy,xx=np.mgrid[0:C,0:C]; d=np.sqrt((xx-C/2)**2+(yy-C/2)**2)
paperTex=cv2.GaussianBlur(rng.normal(0,1,(C,C)).astype(np.float32),(0,0),1.2)*0.012+cv2.GaussianBlur(rng.normal(0,1,(C,C)).astype(np.float32),(0,0),20)*0.25
base=paper[None,None,:]+paperTex[...,None]*np.array([1,1,1])
# teal wash blotch behind shoulders
wash=np.zeros((C,C),np.float32)
cv2.ellipse(wash,(C//2,int(C*0.72)),(int(C*0.42),int(C*0.2)),0,0,360,1,-1)
cv2.circle(wash,(int(C*0.3),int(C*0.35)),int(C*0.16),0.6,-1)
wash=cv2.GaussianBlur(wash,(0,0),45)
wn=cv2.GaussianBlur(rng.normal(0,1,(C,C)).astype(np.float32),(0,0),14)
wash=np.clip(wash*(0.75+0.5*wn),0,1)*0.32
teal=np.array([0.36,0.52,0.50])
base=base*(1-wash[...,None])+teal*wash[...,None]
# place portrait
off=(C-N)//2; oy=off+40
P=base.copy()
sub=P[oy:oy+N-40+40 if False else oy+N, off:off+N]
h=min(N,C-oy)
a=alpha[:h,:,None]
P[oy:oy+h,off:off+N]=P[oy:oy+h,off:off+N]*(1-a)+por[:h]*a
# disc mask with rough edge
edgeN=cv2.GaussianBlur(rng.normal(0,1,(C,C)).astype(np.float32),(0,0),3)*5
disc=np.clip((R+edgeN-d)/2,0,1)
# dry brush rim: ring with angular thickness modulation
ang=np.arctan2(yy-C/2,xx-C/2)
th=6+6*np.sin(ang*1.0+0.6)+3*np.sin(ang*3.3)+2*np.sin(ang*7.1)
th=np.clip(th,1.5,None)
streak=cv2.GaussianBlur(rng.normal(0,1,(C,C)).astype(np.float32),(0,0),0.8)
ringD=np.abs(d-(R-6))
ring=np.clip((th-ringD)/1.5,0,1)*np.clip(0.85+0.35*streak,0,1)
gap=(ang>2.15)&(ang<2.55)
ring[gap]*=np.clip((np.abs(ang[gap]-2.35)/0.2),0,1)
P=P*(1-ring[...,None]*0.92)+ink*ring[...,None]*0.92
out=np.dstack([np.clip(P,0,1),np.maximum(disc,ring*(d<R+25))])
img=Image.fromarray((out*255).astype(np.uint8),'RGBA')
# seal
s=150; seal=Image.new('RGBA',(s,s),(0,0,0,0)); sd=ImageDraw.Draw(seal)
sd.rounded_rectangle([6,6,s-6,s-6],radius=14,fill=(184,67,47,255))
f=ImageFont.truetype('MaShanZheng.ttf',118)
bb=sd.textbbox((0,0),'蕾',font=f); w,h2=bb[2]-bb[0],bb[3]-bb[1]
sd.text(((s-w)/2-bb[0],(s-h2)/2-bb[1]),'蕾',font=f,fill=(246,242,233,255))
sa=np.array(seal).astype(np.float32)
sn=rng.random((s,s))
sa[...,3]*=np.where(sn<0.06,0.25,1.0)
seal=Image.fromarray(sa.astype(np.uint8)).rotate(-5,resample=Image.BICUBIC,expand=True)
img.alpha_composite(seal,(int(C*0.73),int(C*0.72)))
img.save('leijie_ink_logo.png')
img.resize((512,512),Image.LANCZOS).save('preview4.png')
print('ok')
