import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {SceneArt, MascotArt} from './components/SceneArt';

loadFont({family: 'Long Cang', url: staticFile('fonts/LongCang-Regular.ttf')});

const ink = '#292720';
const paper = '#f7f4eb';
const mint = '#8bcbbd';
const red = '#ce705e';
const yellow = '#f0d272';
const hand = '"Long Cang", cursive';
type Kind = 'city' | 'ramen' | 'dog' | 'dance';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const tween = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], {...clamp, easing: Easing.inOut(Easing.cubic)});
const linear = (t: number, a: number, b: number, from = 0, to = 1) => interpolate(t, [a, b], [from, to], clamp);
const Txt: React.FC<{x: number; y: number; size?: number; fill?: string; children: React.ReactNode; anchor?: 'start'|'middle'|'end'; opacity?: number; weight?: number}> =
  ({x, y, size = 22, fill = ink, children, anchor = 'start', opacity = 1, weight}) =>
    <text x={x} y={y} fontFamily={hand} fontSize={size} fill={fill} textAnchor={anchor} opacity={opacity} fontWeight={weight}>{children}</text>;

const Box: React.FC<{x: number; y: number; w: number; h: number; fill?: string; r?: number; opacity?: number}> =
 ({x,y,w,h,fill=paper,r=10,opacity=1}) => <g opacity={opacity}>
   <rect x={x+2} y={y+3} width={w} height={h} rx={r} fill="#39362e" opacity=".07" />
   <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={ink} strokeWidth="2.3" />
   <path d={`M${x+8} ${y+2} Q${x+w/2} ${y-1} ${x+w-9} ${y+2} M${x+1} ${y+12} L${x+2} ${y+h-12}`} fill="none" stroke={ink} strokeWidth=".7" opacity=".45" />
 </g>;

const Star: React.FC<{x: number; y: number; r?:number; fill?:string}> = ({x,y,r=9,fill=yellow}) =>
 <path d={`M${x} ${y-r} Q${x+1} ${y-1} ${x+r} ${y} Q${x+1} ${y+1} ${x} ${y+r} Q${x-1} ${y+1} ${x-r} ${y} Q${x-1} ${y-1} ${x} ${y-r}`} fill={fill} stroke={ink} strokeWidth="1.4" />;

const Thumbnail: React.FC<{kind:Kind; x:number; y:number; w:number; h:number; frame:number; label?:boolean}> = ({kind,x,y,w,h,frame,label=false}) => {
 const name = {city:'夜景.mp4',ramen:'拉面.mp4',dog:'柴犬.mov',dance:'小克蹦迪.mp4'}[kind];
 return <g>
  <svg x={x} y={y} width={w} height={h} viewBox="0 0 240 400" preserveAspectRatio="xMidYMid slice" style={{overflow:'hidden',borderRadius:7}}><SceneArt kind={kind} frame={frame} /></svg>
  <rect x={x} y={y} width={w} height={h} rx="7" fill="none" stroke={ink} strokeWidth="2.4" />
  {label && <><rect x={x+5} y={y+4} width={kind==='dance'?91:62} height="18" rx="7" fill="#fffdf3" opacity=".94"/><Txt x={x+10} y={y+18} size={16}>{name}</Txt></>}
 </g>;
};

const Phone: React.FC<{x:number;y:number;w:number;h:number;kind:Kind;frame:number;t:number;final?:boolean}> = ({x,y,w,h,kind,frame,t,final=false}) => {
 const focus = t>=5 && t<7.5;
 const turning = t>=9 && t<10.8;
 return <g>
  <rect x={x+3} y={y+5} width={w} height={h} rx={w*.135} fill={ink} opacity=".13" />
  <rect x={x} y={y} width={w} height={h} rx={w*.135} fill="#302d29" stroke={ink} strokeWidth="3"/>
  <rect x={x+5} y={y+5} width={w-10} height={h-10} rx={w*.11} fill="#161513" stroke="#666154" strokeWidth="1.7"/>
  <svg x={x+11} y={y+13} width={w-22} height={h-26} viewBox="0 0 240 400" preserveAspectRatio="none" style={{overflow:'hidden',borderRadius:w*.08}}>
   <defs><clipPath id={final?'phone-final-clip':'phone-preview-clip'}><rect width="240" height="400" rx="20"/></clipPath></defs>
   <g clipPath={`url(#${final?'phone-final-clip':'phone-preview-clip'})`}>
   <g style={{filter: focus?'blur(8px) grayscale(.7)':undefined}}><SceneArt kind={kind} frame={frame} final={final} flashy={t>=16.8&&t<18.3?.95:.12} zoom={final?1:t>=18?linear(t,18,19,1,1.15):1}/></g>
   {t>=8&&t<9&&<><rect width="240" height="32" fill="#4c498a"/><Txt x={120} y={25} size={25} fill="white" anchor="middle">· 拉 面 ·</Txt></>}
   {turning&&<path d={`M${240-linear(t,9,10.5,0,175)} 400 Q140 320 240 ${400-linear(t,9,10.5,0,260)} Z`} fill="#e5e3d6" stroke={ink} strokeWidth="2" />}
   {focus&&<g><path d="M29 95v-32h30 M211 95v-32h-30 M29 222v32h30 M211 222v32h-30" fill="none" stroke={ink} strokeWidth="8"/><path d="M29 95v-32h30 M211 95v-32h-30 M29 222v32h30 M211 222v32h-30" fill="none" stroke="white" strokeWidth="5"/><circle cx="120" cy="130" r="21" fill="none" stroke="#b1aca1" strokeWidth="8"/><path d="M120 109a21 21 0 0 1 0 42" fill="none" stroke="white" strokeWidth="7" transform={`rotate(${frame*9} 120 130)`}/><text x="120" y="183" textAnchor="middle" fill="white" stroke={ink} strokeWidth="5" paintOrder="stroke" fontFamily={hand} fontSize="30">对焦中...</text></g>}
   {kind==='dog'&&t>=12&&t<15.8&&<><text x="120" y="236" textAnchor="middle" fill={yellow} stroke={ink} strokeWidth="5" paintOrder="stroke" fontFamily={hand} fontSize="22" fontWeight="bold">{t<14.5?'前方高能预警':'前方高能预警'}</text>{t>=13.2&&t<14.6&&<path d="M38 245q5-8 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0" fill="none" stroke="#e56969" strokeWidth="3"/>}</>}
   </g>
  </svg>
  <rect x={x+w*.42} y={y+13} width={w*.16} height="10" rx="5" fill="#24221f"/>
  <path d={`M${x-2} ${y+h*.28}v25 M${x+w+2} ${y+h*.32}v30`} stroke={ink} strokeWidth="3"/>
  {!final&&<g><Txt x={x+w/2-36} y={y+h+21} size={18} fill="#858276" anchor="middle">◀</Txt><circle cx={x+w/2} cy={y+h+15} r="10" fill="none" stroke="#858276" strokeWidth="1.8"/><Txt x={x+w/2} y={y+h+21} size={18} fill="#858276" anchor="middle">{t>=20?'Ⅱ':'▶'}</Txt><Txt x={x+w/2+36} y={y+h+21} size={18} fill="#858276" anchor="middle">▶</Txt></g>}
 </g>;
};

const Library: React.FC<{t:number;frame:number}> = ({t,frame}) => {
 const tab=t<8?'素材':t<11.6?'转场':t>=12.2?'文字':'转场';
 const names=['素材','转场','文字'];
 return <g>
  <Box x={26} y={66} w={251} h={294}/>
  {names.map((name,i)=><g key={name}><Box x={37+i*77} y={75} w={71} h={27} r={6} fill={tab===name?yellow:paper}/><Txt x={72+i*77} y={95} size={21} anchor="middle">{name}</Txt></g>)}
  {tab==='素材'?<>
   {(['city','ramen','dog','dance'] as const).map((kind,i)=>{const x=40+(i%2)*115;const y=114+Math.floor(i/2)*92;return <g key={kind}><Thumbnail kind={kind} x={x} y={y} w={104} h={65} frame={frame}/><Txt x={x+53} y={y+79} size={19} anchor="middle">{{city:'夜景.mp4',ramen:'拉面.mp4',dog:'柴犬.mov',dance:'小克蹦迪.mp4'}[kind]}</Txt><rect x={x+72} y={y+44} width="28" height="16" rx="5" fill={ink} opacity=".75"/><Txt x={x+85} y={y+57} size={13} fill="white" anchor="middle">{['2.4s','4.6s','2.4s','2.8s'][i]}</Txt></g>;})}
   {[0,1].map(i=><g key={i}><rect x={40+i*115} y="300" width="104" height="45" rx="6" fill="none" stroke="#aaa597" strokeDasharray="4 5" strokeWidth="1.4"/><Txt x={91+i*115} y={330} size={35} fill="#aaa597" anchor="middle">+</Txt><Txt x={91+i*115} y={357} size={16} fill="#aaa597" anchor="middle">导入素材</Txt></g>)}
  </>:tab==='转场'?<>
   {['旋转','翻页','故障','缩放','滑动','溶解'].map((name,i)=>{const x=40+(i%2)*115,y=114+Math.floor(i/2)*78;return <g key={name}><Box x={x} y={y} w={104} h={57} r={6} fill={['#d9d3ef','#c6e6d8','#efd4de','#d5edf4','#f8e8b7','#ddd8c9'][i]}/><Txt x={x+52} y={y+40} size={36} anchor="middle">{['◎','▤','▣','⌕','▸','░'][i]}</Txt><Txt x={x+52} y={y+74} size={19} anchor="middle">{name}</Txt></g>;})}
  </>:<>
   <Txt x={43} y={129} size={17} fill="#aaa597">标题</Txt>
   <Box x={40} y={140} w={219} h={54} fill="#f9e6a8" r={6}/><Txt x={150} y={177} size={32} anchor="middle" weight={600}>前方高能</Txt>
   <Box x={40} y={210} w={219} h={54} fill="#f2dce6" r={6}/><Txt x={150} y={246} size={29} fill="#c777a4" anchor="middle">好耶—</Txt>
   <Box x={40} y={280} w={219} h={54} fill="#332c43" r={6}/><Txt x={150} y={316} size={24} fill="#f5d6ef" anchor="middle">霓虹 NEON</Txt>
  </>}
 </g>;
};

const Adjustments: React.FC<{t:number}> = ({t}) => {
 const flash=t<15.8?0:t<17?linear(t,15.8,16.7,0,.85):.7;
 const saturation=t<16.8?.5:t<18?linear(t,16.8,17.4,.5,.2):.36;
 const zoom=t<17.7?0:linear(t,17.7,18.7,0,.6);
 const speed=t<23? .5:t<25.4?linear(t,23,24.4,.5,.75):.5;
 return <g><Box x={1006} y={66} w={247} h={294}/><Txt x={1020} y={98} size={30}>调整</Txt><Star x={1094} y={90} r={9}/><path d="M1020 108H1240" stroke="#a6a195" strokeWidth="1.2"/>
 {['闪光','饱和度','缩放冲击','速度'].map((name,i)=>{const y=136+i*61,value=[flash,saturation,zoom,speed][i];return <g key={name}><Txt x={1020} y={y} size={23}>{name}</Txt><Txt x={1238} y={y} size={20} fill="#777366" anchor="end">{[`${Math.round(flash*100)}%`,t<16.8?'100%':'110%',`${Math.round(zoom*100)}%`,t>=23&&t<25?'1.3x':'1.0x'][i]}</Txt><rect x="1024" y={y+15} width="214" height="7" rx="4" fill="#dedbd1" stroke={ink} strokeWidth="1.4"/><rect x="1024" y={y+15} width={214*value} height="7" rx="4" fill={mint}/><circle cx={1024+214*value} cy={y+18.5} r="9.5" fill="#fffdf6" stroke={ink} strokeWidth="2"/><circle cx={1024+214*value} cy={y+18.5} r="2" fill="#a6a195"/></g>;})}
 </g>;
};

const Timeline: React.FC<{t:number;frame:number}> = ({t,frame}) => {
 const populated=t>=4;
 const cut=t>=7.4;
 const xs=cut?[103,290,475,658]:[103,290,625,808];
 const widths=cut?[185,183,181,218]:[185,333,181,218];
 const cursor=103+(t<5?Math.max(0,t-2)*30:t<7.6?linear(t,5,7.6,315,348):t<11.8?linear(t,7.6,11.8,185,650):t<15.6?linear(t,11.8,15.6,395,615):t<23?linear(t,15.6,23,500,780):linear(t,23,26,780,900));
 return <g><Box x={25} y={372} w={1230} h={326}/>
 {[0,1,2].map(i=><g key={i}><rect x="32" y={426+i*72} width="47" height={i===1?62:40} rx="7" fill={['#f7e9b8','#c9e6dc','#ded7ec'][i]} stroke={ink} strokeWidth="2"/><Txt x={55} y={455+i*72} size={i===1?28:27} anchor="middle">{['T','▶','♪'][i]}</Txt></g>)}
 <path d="M98 413H1240" stroke={ink} strokeWidth="1.5"/>
 {Array.from({length:49},(_,i)=><g key={i}><path d={`M${103+i*23.2} 413v-${i%8===0?18:i%2===0?10:5}`} stroke="#aaa69b" strokeWidth="1.1"/>{i%8===0&&<Txt x={103+i*23.2} y={392} size={18} fill="#77766a" anchor="middle">0:{String(i/8*2).padStart(2,'0')}</Txt>}</g>)}
 {[0,1,2].map(i=><rect key={i} x="89" y={429+i*72} width="1155" height={i===1?68:43} rx="4" fill={i%2?'#eeeae2':'#f0ede6'} opacity=".63"/>)}
 {(['city','ramen','dog','dance'] as const).map((kind,i)=>{
  const appears=[2.3,3,3.5,3.95][i]; if(t<appears)return null;
  const x=xs[i],w=widths[i],y=475;
  const arrival=tween(t,appears,appears+.35); const copies=Math.ceil(w/70);
  return <g key={kind} opacity={arrival} transform={`translate(0 ${-35*(1-arrival)})`}>
   <rect x={x} y={y} width={w} height="68" rx="6" fill={{city:'#494568',ramen:'#f0d383',dog:'#b2d9ca',dance:'#9c7fb5'}[kind]}/>
   {Array.from({length:copies},(_,n)=><svg key={n} x={x+n*w/copies} y={y+2} width={w/copies} height="65" style={{overflow:'hidden'}}><SceneArt kind={kind} frame={0}/></svg>)}
   <rect x={x} y={y} width={w} height="68" rx="6" stroke={ink} strokeWidth="2.4" fill="none"/>
   <rect x={x+5} y={y+5} width={i===3?95:65} height="18" rx="6" fill="#fffaf0"/><Txt x={x+11} y={y+19} size={16}>{['夜景.mp4','拉面.mp4','柴犬.mov','小克蹦迪.mp4'][i]}</Txt>
   {i===1&&!cut&&<g><rect x={x+121} y={y+1} width="123" height="66" fill="#9a9992" opacity=".83"/>{Array.from({length:20},(_,n)=><path key={n} d={`M${x+121+n*6} ${y+1}l-35 66`} stroke="#52524e" strokeWidth="1" opacity=".5"/>)}<path d={`M${x+121} ${y}v68 M${x+244} ${y}v68`} stroke={red} strokeWidth="2" strokeDasharray="5 4"/><Txt x={x+182} y={y+43} size={26} fill="#d4d2cb" anchor="middle">Z Z Z</Txt></g>}
  </g>;
 })}
 {t>=4.1&&<g opacity={tween(t,4.1,4.5)}><rect x="103" y="557" width={1133*tween(t,4.1,4.5)} height="41" rx="6" fill="#e4dcf5" stroke={ink} strokeWidth="2"/><g opacity={populated?1:0}>{Array.from({length:270},(_,i)=>{const h=6+Math.abs(Math.sin(i*.8)*Math.cos(i*.16))*28;return <path key={i} d={`M${110+i*4.15} ${585-h/2}v${h}`} stroke="#a697d3" strokeWidth="1.8"/>;})}</g><rect x="109" y="561" width="100" height="17" rx="5" fill="#fffdf6"/><Txt x={115} y={574} size={15}>♪ bgm_小克.wav</Txt></g>}
 {t>=8.2&&<g><circle cx="290" cy="509" r="15" fill="#fffdf4" stroke={ink} strokeWidth="2"/><Txt x={290} y={519} size={31} fill="#54a897" anchor="middle">◎</Txt></g>}
 {t>=10&&<g><circle cx="475" cy="509" r="15" fill="#fffdf4" stroke={ink} strokeWidth="2"/><Txt x={475} y={519} size={27} anchor="middle">▤</Txt></g>}
 {t>=11.4&&<g><circle cx="658" cy="509" r="15" fill="#e3dcef" stroke={ink} strokeWidth="2"/><Txt x={658} y={518} size={25} anchor="middle">▣</Txt></g>}
 {t>=12.2&&<g opacity={tween(t,12.2,12.6)}><rect x="477" y="440" width="180" height="28" rx="6" fill={yellow} stroke={ink} strokeWidth="2"/><Txt x={486} y={461} size={20}>T 前方高能预警</Txt></g>}
 {t>=20.4&&Array.from({length:36},(_,i)=>{const show=t>=20.4+i*.065;return show?<path key={i} d={`M${103+i*30} 610l6 11 6-11Z`} fill={yellow} stroke={ink} strokeWidth="1"/>:null;})}
 {t>=21.5&&<><Box x={1130} y={604} w={102} h={32} fill={yellow} r={5}/><Txt x={1180} y={627} size={23} anchor="middle">▽ 卡点</Txt></>}
 <path d={`M${cursor} 412V631`} stroke="#e37780" strokeWidth="2.3"/>
 <path d={`M${cursor-8} 393h16v11l-8 10-8-10Z`} fill="#df747b" stroke={ink} strokeWidth="1.5"/>
 <path d="M52 670h10 M69 670h100 M175 665v10 M170 670h10" stroke="#a6a195" strokeWidth="1.3"/><circle cx="114" cy="670" r="4" fill="white" stroke="#a6a195"/>
 <Txt x={1240} y={679} size={15} fill="#aaa597" anchor="end">片段 4 · 总时长 0:10.5</Txt>
 </g>;
};

const Bubble: React.FC<{x:number;y:number;w?:number;children:React.ReactNode;size?:number}> = ({x,y,w=116,children,size=26}) => <g><path d={`M${x+10} ${y}Q${x-3} ${y} ${x} ${y+16}L${x+1} ${y+34}Q${x} ${y+45} ${x+14} ${y+44}L${x+w*.52} ${y+44}l8 16 5-17H${x+w-10}Q${x+w+4} ${y+43} ${x+w} ${y+29}V${y+13}Q${x+w} ${y-2} ${x+w-13} ${y}Z`} fill="#fffdf3" stroke={ink} strokeWidth="2.4"/><Txt x={x+w/2} y={y+32} size={size} anchor="middle">{children}</Txt></g>;

const Worker: React.FC<{t:number;frame:number}> = ({t,frame}) => {
 if(t<1.65)return null;
 let x=155,y=410,tx=91,ty=144,extended=false,happy=false;
 if(t<2.4){y=linear(t,1.65,1.95,-70,410);tx=87;ty=145;extended=t>2.05;}
 else if(t<4.2){x=180;tx=t<3.1?207:t<3.7?91:207;ty=t<3.1?143:235;extended=true;}
 else if(t<5){x=195;happy=true;}
 else if(t<7.5){x=200;tx=420;ty=505;extended=true;}
 else if(t<8){x=232;}
 else if(t<11.4){x=205;tx=t<9.3?92:206;ty=143;extended=true;}
 else if(t<12.2){x=215;tx=225;ty=89;extended=true;}
 else if(t<14){x=190;}
 else if(t<15.3){x=250;happy=true;}
 else if(t<19.9){x=460;tx=1024+214*(t<17?.83:t<18?.22:.6);ty=t<17?154:t<18?215:276;extended=true;}
 else if(t<21.3){x=435;happy=true;}
 else if(t<23){x=750;y=540;happy=true;}
 else if(t<25.6){x=870;y=540;tx=1130;ty=t<24.1?32:336;extended=true;}
 else{x=1038;y=565;happy=true;}
 const drags=[{a:2.05,b:2.7,x:91,y:144,end:145},{a:2.75,b:3.3,x:207,y:144,end:400},{a:3.35,b:3.85,x:91,y:235,end:680},{a:3.88,b:4.2,x:207,y:235,end:850}];
 const drag=drags.find(d=>t>=d.a&&t<d.b);
 if(drag){const p=tween(t,drag.a,drag.b);tx=drag.x+(drag.end-drag.x)*p;ty=drag.y+(492-drag.y)*p;extended=true;}
 const sway=Math.sin(frame*.15)*1.5;
 return <g>
  {extended&&<g><path d={`M${x+43} ${y+13}Q${(x+tx)/2} ${(y+ty)/2+25} ${tx} ${ty}`} fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round"/><path d={`M${x+43} ${y+13}Q${(x+tx)/2} ${(y+ty)/2+25} ${tx} ${ty}`} fill="none" stroke={red} strokeWidth="8" strokeLinecap="round"/><circle cx={tx} cy={ty} r="7" fill={red} stroke={ink} strokeWidth="2"/></g>}
  <svg x={x-25} y={y-26+sway} width="121" height="101" viewBox="0 0 180 150"><MascotArt frame={frame} happy={happy} sunglasses={t>=20} cheeks={t>=25.5} raised={false}/></svg>
  {t>=1.95&&t<2.45&&<Bubble x={x-9} y={y-81} w={109}>开工!</Bubble>}
  {t>=5.25&&t<6.75&&<Bubble x={x+150} y={y-35} w={165} size={23}>这段在发呆 zzz</Bubble>}
  {t>=7.2&&t<7.8&&<Bubble x={x+92} y={y-66} w={75}>删!</Bubble>}
  {t>=19.8&&t<20.6&&<Bubble x={x-2} y={y-82} w={90}>稳了</Bubble>}
 </g>;
};

const Editor: React.FC<{t:number;frame:number}> = ({t,frame}) => {
 const kind:Kind=t<4.9?'city':t<11.1?'ramen':t<15.5?'dog':'dance';
 const phoneX=interpolate(t,[0,4.6,5.4,7.6,8.1,11.3,12],[562,562,523.5,523.5,533.85,533.85,562],clamp);
 const exported=t>=25.7;
 return <g><Box x={13} y={8} w={1254} h={704} r={15}/><Box x={25} y={17} w={1230} h={38} r={8} fill="#f0ebdf"/>
 {[0,1,2].map(i=><circle key={i} cx={42+i*15} cy="35" r="4.5" fill={['#e6a49a','#edda8e','#afd1b7'][i]} stroke={ink} strokeWidth="1"/>)}
 <Txt x={91} y={43} size={23}>▣ 小克剪辑_最终版_打死不改(3).mp4</Txt>
 <rect x="568" y="22" width="145" height="27" rx="6" fill={ink}/><Txt x={640} y={42} size={22} fill="white" anchor="middle">00:00:{String(Math.floor(t)).padStart(2,'0')}:{String(frame%30).padStart(2,'0')}</Txt><Txt x={743} y={42} size={16} fill="#928e82">· 已自动保存</Txt>
 <Box x={993} y={24} w={60} h={25} r={5}/><Txt x={1023} y={43} size={18} anchor="middle">1080p</Txt>
 <Box x={1065} y={22} w={178} h={28} r={7} fill={t>=23.3&&!exported?yellow:mint}/><Txt x={1153} y={44} size={24} fill={t>=23.3&&!exported?ink:'white'} anchor="middle">{exported?'完成 ✓':t>=24?'渲染中 99.99%':t>=23.3?`渲染中 ${Math.round(linear(t,23.3,24,0,99))}%`:'↥ 导出'}</Txt>
 <Library t={t} frame={frame}/><Adjustments t={t}/>{t<26.4&&<Phone x={phoneX} y={65} w={192} h={287} kind={kind} frame={frame} t={t}/>}<Timeline t={t} frame={frame}/>{t<26.4&&<Worker t={t} frame={frame}/>}
 {([{a:2.05,b:2.7,x:40,y:114,end:103,kind:'city'},{a:2.75,b:3.3,x:155,y:114,end:350,kind:'ramen'},{a:3.35,b:3.85,x:40,y:206,end:625,kind:'dog'},{a:3.88,b:4.2,x:155,y:206,end:808,kind:'dance'}] as const).map(d=>{if(t<d.a||t>=d.b)return null;const p=tween(t,d.a,d.b);return <g key={d.kind} transform={`rotate(${-6*Math.sin(p*Math.PI)} ${d.x+(d.end-d.x)*p+50} ${d.y+(475-d.y)*p+30})`}><Thumbnail kind={d.kind} x={d.x+(d.end-d.x)*p} y={d.y+(475-d.y)*p} w={104} h={65} frame={frame} label/></g>;})}
 {t>=5.7&&t<7.7&&<g><path d="M423 470q17-44 30-40q-17 39-18 78q-1 12-12-38Z" fill="#fff8c9" stroke={ink} strokeWidth="2"/><Star x={438} y={459} r={7}/></g>}
 {t>=7.2&&t<7.85&&<g transform={`translate(${tween(t,7.2,7.7,600,1167)} ${tween(t,7.2,7.7,506,605)}) rotate(${linear(t,7.2,7.7,0,155)})`}><rect x="-45" y="-25" width="90" height="50" fill="#98968e" stroke={ink} strokeWidth="2"/><Txt x={0} y={9} size={23} fill="#d5d1c6" anchor="middle">Z Z Z</Txt></g>}
 {t>=7.2&&t<8&&<g><path d="M1190 603h35l-4 44h-28Z M1184 599h47 M1200 590h15" fill="#ebe7dc" stroke={ink} strokeWidth="2"/><Txt x={1180} y={587} size={31} fill={red} anchor="middle">删!</Txt></g>}
 {t>=11.15&&t<12&&Array.from({length:14},(_,i)=><Star key={i} x={650+Math.cos(i*1.7)*linear(t,11.15,12,8,110)} y={505+Math.sin(i*1.7)*linear(t,11.15,12,8,75)} r={4+i%3} fill={['#edcf77','#cf819e','#bfdbc9'][i%3]}/>)}
 {t>=14&&t<14.7&&<g transform={`translate(177 550) rotate(-3)`}><Box x={0} y={0} w={196} h={126} fill="#fffaf0" r={10}/><path d="M0 21H196 M15 0v21 M36 0v21 M57 0v21 M78 0v21 M99 0v21 M120 0v21 M141 0v21 M162 0v21 M183 0v21" stroke={ink} strokeWidth="2"/><text x="98" y="88" textAnchor="middle" fontFamily="Arial" fontSize="42" fill={ink} fontWeight="bold">Ctrl+Z</text></g>}
 {t>=14.6&&t<15.4&&<g transform="translate(790 220) rotate(-11)"><rect x="0" y="0" width="140" height="57" rx="6" fill="none" stroke="#6ba47b" strokeWidth="2"/><rect x="5" y="5" width="130" height="47" rx="4" fill="none" stroke="#6ba47b"/><Txt x={70} y={41} size={35} fill="#6ba47b" anchor="middle">已修正</Txt></g>}
 {t>=16.9&&t<18.1&&<g><text x="657" y="160" textAnchor="middle" fontFamily={hand} fontSize="41" fontWeight="bold" fill="#ef6cac" stroke={ink} strokeWidth="3" paintOrder="stroke">饱和度:拉满</text><Bubble x={450} y={343} w={145} size={22}>……太亮了</Bubble></g>}
 {t>=21&&t<22.4&&<text x="686" y="660" textAnchor="middle" fill="#69b5a6" fontFamily={hand} fontWeight="bold" stroke={ink} strokeWidth="2.5" paintOrder="stroke" fontSize="38">卡点！</text>}
 {t>=24.5&&t<25.6&&<g><Txt x={1050} y={530} size={42} fill={red} anchor="middle">BONK!</Txt><Star x={1135} y={42} r={15}/><path d="M1052 498l75-130" stroke={ink} strokeWidth="8" strokeLinecap="round"/><path d="M1052 498l75-130" stroke="#b48b62" strokeWidth="5" strokeLinecap="round"/><rect x="1098" y="340" width="60" height="30" rx="7" fill="#c8a074" stroke={ink} strokeWidth="2" transform="rotate(28 1130 355)"/></g>}
 </g>;
};

const Terminal: React.FC<{t:number}> = ({t}) => {
 const lines=['const 剪辑软件 = 小克.写代码()','剪辑软件.画出(时间轴, 预览, 面板)','小克.钻进去()'];
 const count=Math.floor(linear(t,.03,.62,0,82));
 let offset=0;
 return <g><Box x={312} y={247} w={656} h={202} fill="#fffdf5" r={11}/><path d="M313 282H967" stroke="#aaa59a"/><path d="M322 250H957q8 0 8 9v21H315v-19q0-11 7-11" fill="#f1eadc"/>
 {[0,1,2].map(i=><circle key={i} cx={336+i*16} cy="267" r="5" fill={['#dc7778','#e7d57e','#a8ceb0'][i]} stroke={ink} strokeWidth="1.3"/>)}<Txt x={640} y={273} size={20} anchor="middle">小克.js — 终端</Txt>
 {lines.map((line,i)=>{const n=Math.max(0,count-offset);offset+=line.length;return <g key={line}><Txt x={339} y={329+i*46} size={21} fill="#bbb4a7">{i+1}</Txt><Txt x={376} y={329+i*46} size={23}>{line.slice(0,n)}</Txt>{n>=0&&n<line.length&&<rect x={376+Math.min(n,line.length)*16} y={309+i*46} width="10" height="27" fill={red}/>}</g>;})}
 </g>;
};

/** Camera poses are explicit timeline data, with smooth eased interpolation. */
const camera = (t:number) => {
 const times=[0,1.4,2,4.6,5.4,7.6,8.1,11.3,12,15.1,15.7,17.9,19.8,20.8,21.5,23.5,25.8,26.5];
 const zs=[1,1,1.15,1.15,1.35,1.35,1.3,1.3,1.4,1.4,1.43,1.43,1.35,1.35,1.1,1.35,1.46,1];
 const xs=[0,0,-47,-47,-20,-20,0,0,-226,-226,-556,-556,-431,-431,-97,-438,-585,0];
 const ys=[0,0,-75,-75,-177,-177,-83,-83,-88,-88,-15,-15,-34,-34,-59,-8,3,0];
 const options={...clamp,easing:Easing.inOut(Easing.cubic)};
 return {z:interpolate(t,times,zs,options),x:interpolate(t,times,xs,options),y:interpolate(t,times,ys,options)};
};

export const ClaudeEditingMotion: React.FC = () => {
 const frame=useCurrentFrame(),t=frame/30;
 const c=camera(t),final=t>=26.4;
 const endProgress=tween(t,26.4,27.1);
 const terminalExit=tween(t,.65,1.08);
 const finalKind:Kind=t<27.05?'city':t<27.55?'ramen':t<28?'dog':'dance';
 return <AbsoluteFill style={{background:'#f4eee6'}}>
  <Audio src={staticFile('audio/score.wav')} volume={.65}/>
  <svg width="1280" height="720" viewBox="0 0 1280 720" style={{fontFamily:hand}}>
   <defs><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
   {t<1.1&&<g opacity={1-terminalExit} transform={`translate(${-340*terminalExit} ${-180*terminalExit}) rotate(${-8*terminalExit} 640 360)`}><Terminal t={t}/></g>}
   {t>=.8&&<g opacity={linear(t,.8,1.45)} transform={`translate(${c.x} ${c.y}) scale(${c.z})`}><Editor t={t} frame={frame}/></g>}
   {final&&<g><rect x="0" y="0" width="1280" height="720" fill={paper} opacity={.69*endProgress}/>
    <g opacity={endProgress} transform={`translate(${-60*(1-endProgress)} 0) rotate(-1.5 225 328)`}>
     <Box x={45} y={165} w={358} h={320} fill="#fffef8" r={9}/>
     {Array.from({length:6},(_,i)=><path key={i} d={`M60 ${218+i*45}H387`} stroke="#d3e0df" strokeWidth="1" opacity=".65"/>)}
     <rect x="174" y="160" width="97" height="21" fill="#e3bf4c" opacity=".82" transform="rotate(2 220 170)"/>
     <Txt x={73} y={245} size={39}>30 秒剪完，</Txt>
     <text x="75" y="357" fontFamily={hand} fontSize="79" fill={ink}>Opus 5.5</text>
     <path d="M70 383Q236 362 379 383" fill="none" stroke={red} strokeWidth="4" strokeLinecap="round"/>
     <Txt x={170} y={450} size={36}>— 小克 收工</Txt><Star x={375} y={434} r={13}/>
    </g>
    <Phone x={linear(t,26.4,27.1,562,449)} y={linear(t,26.4,27.1,65,128)} w={linear(t,26.4,27.1,192,303)} h={linear(t,26.4,27.1,287,464)} kind={finalKind} frame={frame} t={t} final/>
    <svg x="940" y="452" width="181" height="151" opacity={endProgress}><MascotArt frame={frame} sunglasses happy cheeks/></svg>
    <Star x={1118} y={466} r={7}/><Star x={1107} y={489} r={13} fill="#fffdf3"/>
    {Array.from({length:30},(_,i)=>{const p=linear(t,27.4+i*.013,30);const x=620+Math.sin(i*14.8)*550,y=80+p*560+(i%6)*16;return <rect key={i} x={x} y={y} width="5" height="8" fill={['#e7ce78','#bbabc8','#a9cdc2','#d4938d'][i%4]} stroke={ink} strokeWidth=".8" opacity={linear(t,27.4,27.8)*.85} transform={`rotate(${i*29+frame*2} ${x} ${y})`}/>;})}
   </g>}
   <rect width="1280" height="720" fill="#eae5d6" opacity=".035" filter="url(#paper-grain)" pointerEvents="none"/>
  </svg>
 </AbsoluteFill>;
};
