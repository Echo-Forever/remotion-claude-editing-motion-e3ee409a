import React from 'react';

export type SceneKind = 'city' | 'ramen' | 'dog' | 'dance';
export type SceneArtProps = {
  kind: SceneKind;
  frame?: number;
  final?: boolean;
  flashy?: number;
  zoom?: number;
};

const ink = '#302b27';
const line = {stroke: ink, strokeWidth: 2.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const stars = [[26,31,1.3],[67,17,1.2],[159,35,1.5],[191,31,.9],[217,73,.8],[91,72,.8],[55,111,1.3],[22,107,1],[37,99,1],[90,137,.8],[128,111,.8],[113,173,1],[185,160,1],[206,143,.8],[151,200,1],[174,179,.8],[33,194,.8],[215,220,1],[129,46,.8]];

const Spark = ({x,y,size=7,color='#f9f6df',opacity=1}: {x:number;y:number;size?:number;color?:string;opacity?:number}) => (
  <path d={`M ${x} ${y-size} Q ${x+size*.24} ${y-size*.24} ${x+size} ${y} Q ${x+size*.24} ${y+size*.2} ${x} ${y+size} Q ${x-size*.2} ${y+size*.22} ${x-size} ${y} Q ${x-size*.25} ${y-size*.22} ${x} ${y-size}`} fill={color} stroke={ink} strokeWidth={size>6?1.6:.7} opacity={opacity}/>
);
const Heart = ({x,y,size=13,fill='#e798b5'}: {x:number;y:number;size?:number;fill?:string}) => <path d={`M ${x} ${y+size*.75} C ${x-size*1.9} ${y-size*.55} ${x-size*.45} ${y-size*1.65} ${x} ${y-size*.75} C ${x+size*.8} ${y-size*1.8} ${x+size*1.8} ${y-size*.45} ${x} ${y+size*.75} Z`} fill={fill} {...line} strokeWidth={2.4}/>;

function City({frame,id}: {frame:number;id:string}) {
  const buildingData = [
    [-5,227,29,176,'#41415e'],[16,245,30,160,'#414262'],[42,205,31,195,'#3d3f65'],[71,228,33,173,'#414567'],[103,236,27,166,'#35394f'],[132,208,34,193,'#393d5b'],[163,212,27,190,'#3e4267'],[190,209,28,193,'#454464'],[217,233,29,168,'#30354f'],[6,265,35,137,'#32364c'],[48,265,29,138,'#363950'],[78,246,35,156,'#34374e'],[116,266,31,136,'#32354d'],[151,264,37,138,'#36394e'],[184,242,28,160,'#32374f']
  ] as const;
  return <>
    <defs>
      <linearGradient id={`${id}-city-sky`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#323b61"/><stop offset=".5" stopColor="#51588b"/><stop offset="1" stopColor="#757496"/></linearGradient>
      <radialGradient id={`${id}-moon-glow`}><stop stopColor="#ebd56b" stopOpacity=".24"/><stop offset="1" stopColor="#e9d674" stopOpacity="0"/></radialGradient>
      <pattern id={`${id}-city-grain`} width="11" height="9" patternUnits="userSpaceOnUse"><path d="M1 2h.8M8 7h.5" stroke="#fbf8ec" strokeWidth=".5" opacity=".1"/></pattern>
    </defs>
    <rect width="240" height="400" fill={`url(#${id}-city-sky)`}/>
    <circle cx="170" cy="96" r="65" fill={`url(#${id}-moon-glow)`}/>
    {stars.map(([x,y,s],i)=><circle key={i} cx={x} cy={y} r={s} fill="#e5e7ee" opacity={.58+.22*Math.sin(frame/24+i)}/>)}
    <Spark x={57} y={134} size={4.5}/><Spark x={158} y={202} size={6.5}/><Spark x={143} y={218} size={3.5}/>
    <path d="M168 65 C144 70 141 101 157 115 C171 128 192 122 204 104 C184 111 164 100 168 65 Z" fill="#f2d568" {...line} strokeWidth={2.6}/>
    <path d="M150 97 Q156 103 162 98" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
    {buildingData.map(([x,y,w,h,color],i)=><g key={i}>
      <path d={`M${x} 400 L${x} ${y+1} L${x+w-1} ${y} L${x+w} 400 Z`} fill={color} {...line} strokeWidth="1.9"/>
      {i===2&&<path d={`M${x+9} ${y}v-9h10v9`} fill={color} {...line} strokeWidth="1.7"/>}
      {i===5&&<><path d={`M${x+14} ${y}v-9`} stroke={ink} strokeWidth="2"/><circle cx={x+14} cy={y-10} r="2.7" fill="#dd7976"/></>}
      {Array.from({length:Math.floor((h-12)/21)}).map((_,row)=>Array.from({length:Math.floor((w-7)/10)}).map((__,col)=>{
        const lit=(i*19+row*7+col*3)%6<4;
        return <rect key={`${row}-${col}`} x={x+6+col*10} y={y+10+row*21} width="4.8" height="7.8" fill={lit?((i+row+col)%3===0?'#e8cf67':'#d2be63'):'#51516d'} opacity={lit?.92:.5}/>;
      }))}
    </g>)}
    <rect width="240" height="400" fill={`url(#${id}-city-grain)`}/>
  </>;
}

function Ramen({frame,id}: {frame:number;id:string}) {
  const sway = Math.sin(frame/30)*2;
  return <>
    <defs>
      <linearGradient id={`${id}-ramen-bg`} x2="0" y2="1"><stop stopColor="#f6e0a1"/><stop offset="1" stopColor="#f8e3ae"/></linearGradient>
      <pattern id={`${id}-ramen-wall`} width="31" height="33" patternUnits="userSpaceOnUse"><circle cx="8" cy="11" r="1.6" fill="#fff6d3"/><circle cx="25" cy="27" r="1.2" fill="#fff4d1"/></pattern>
    </defs>
    <rect width="240" height="400" fill={`url(#${id}-ramen-bg)`}/>
    <rect width="240" height="282" fill={`url(#${id}-ramen-wall)`}/>
    <path d="M0 278L240 280V400H0Z" fill="#e6b77f" stroke={ink} strokeWidth="2.7"/>
    {[296,319,349,382].map(y=><path key={y} d={`M10 ${y} Q 105 ${y-3} 233 ${y-1}`} fill="none" stroke="#c28e5d" strokeWidth="1" opacity=".5"/>)}
    <g transform="rotate(-2 120 27)">
      <path d="M-2 0H242V52Q195 47 145 54Q70 57-2 57Z" fill="#4d4c80" {...line}/>
      {[42,94,150,205].map(x=><path key={x} d={`M${x} 0l6 53`} fill="none" stroke="#d1b46b" strokeWidth="2.4"/>)}
      <text x="65" y="40" fill="#fffef2" fontFamily="'Long Cang', 'LongCang', serif" fontWeight="bold" fontSize="33">拉</text>
      <text x="122" y="39" fill="#fffef2" fontFamily="'Long Cang', 'LongCang', serif" fontWeight="bold" fontSize="33">面</text>
      <circle cx="20" cy="32" r="8" fill="#fffdf1"/><circle cx="189" cy="29" r="8" fill="#fffdf1"/>
    </g>
    <ellipse cx="123" cy="326" rx="79" ry="8" fill="#a1754e" opacity=".23"/>
    <path d="M31 224 C38 284 54 318 122 322 C177 322 200 293 211 224 Z" fill="#faf8e9" {...line}/>
    <path d="M92 321h60l-1 7H91Z" fill="#fffdf3" {...line} strokeWidth="2"/>
    <ellipse cx="121" cy="226" rx="91" ry="29" fill="#fcfaeb" {...line}/>
    <ellipse cx="121" cy="229" rx="80" ry="21" fill="#b08549" stroke={ink} strokeWidth="2"/>
    <path d="M40 239Q123 267 203 239L198 271Q123 296 46 269Z" fill="#fff1e3"/>
    <path d="M42 246Q120 273 201 246M46 267Q124 290 197 268" fill="none" stroke="#d86c77" strokeWidth="3"/>
    {Array.from({length:11}).map((_,i)=>{
      const x=49+i*13; const y=250+Math.sin(i/10*Math.PI)*12;
      return <path key={i} d={`M${x} ${y}v12h8v-8h-4v4M${x+8} ${y+12}v-12h5`} fill="none" stroke="#d76d78" strokeWidth="2.5" strokeLinejoin="round"/>;
    })}
    {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${52+i*15} ${225+(i%2)*4}q12-12 24 0t22-2`} fill="none" stroke="#ebcf82" strokeWidth="2"/>)}
    <ellipse cx="89" cy="216" rx="21" ry="11" transform="rotate(-12 89 216)" fill="#db7e88" stroke={ink} strokeWidth="2"/>
    <ellipse cx="89" cy="216" rx="14" ry="6" transform="rotate(-12 89 216)" fill="#b65565"/>
    <path d="M145 193l31 2-1 29-31-2Z" fill="#30554a" {...line} strokeWidth="2"/>
    {[151,158,167].map(x=><path key={x} d={`M${x} 194v28`} stroke="#6b8261" strokeWidth="1"/>)}
    {[201,208,215].map(y=><path key={y} d={`M145 ${y}l29 2`} stroke="#839370" strokeWidth="1"/>)}
    <ellipse cx="74" cy="238" rx="17" ry="11" transform="rotate(13 74 238)" fill="#fff7d6" {...line} strokeWidth="2"/>
    <ellipse cx="75" cy="238" rx="8" ry="7" fill="#e2ad4f"/>
    <ellipse cx="164" cy="238" rx="18" ry="12" transform="rotate(-9 164 238)" fill="#fff3e6" {...line} strokeWidth="1.8"/>
    <path d="M153 239c-3-9 15-13 16-5 2 9-13 9-10 2 2-4 7-3 6 1" fill="none" stroke="#d46f9a" strokeWidth="3" strokeLinecap="round"/>
    {[47,61,103,136,176,191].map((x,i)=><path key={x} d={`M${x} ${231+(i%2)*9}l6-1 2 4-7 1Z`} fill="#6c9762" stroke="#425b3e" strokeWidth=".7"/>)}
    <g transform={`translate(${sway} 0)`}>
      {Array.from({length:9}).map((_,i)=><path key={i} d={`M${128+i*.45} 141 Q${124+i*1.9} 172 ${112+i*3.1} 228`} fill="none" stroke={ink} strokeWidth="2.7"/>)}
      {Array.from({length:9}).map((_,i)=><path key={i} d={`M${128+i*.45} 141 Q${124+i*1.9} 172 ${112+i*3.1} 228`} fill="none" stroke="#f7e4ae" strokeWidth="1.7"/>)}
      <path d="M130 139L242 50M135 145L242 62" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
      <path d="M130 139L242 50M135 145L242 62" stroke="#b48e59" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    {[0,1].map(i=><path key={i} d={`M${89+i*29} ${164+i*10}q-13-14 0-26t-2-22`} transform={`translate(0 ${Math.sin(frame/18+i)*3})`} fill="none" stroke="#fffdf0" strokeWidth="4" strokeLinecap="round" opacity=".7"/>)}
  </>;
}

function Dog({frame,id}: {frame:number;id:string}) {
  const bob=Math.sin(frame/18)*2.3;
  return <>
    <defs><pattern id={`${id}-dog-dots`} width="29" height="31" patternUnits="userSpaceOnUse"><circle cx="11" cy="12" r="2.5" fill="#e6f7e5" opacity=".7"/></pattern></defs>
    <rect width="240" height="400" fill="#a9d8c9"/><rect width="240" height="400" fill={`url(#${id}-dog-dots)`}/>
    <g transform={`translate(0 ${bob})`}>
      <path d="M211 254q28-26 28 12q-2 18-28 24" fill="#d38d48" {...line}/>
      <path d="M39 400L41 313Q47 283 82 279H168Q212 287 214 321V401Z" fill="#cf8947" {...line}/>
      <path d="M102 279Q76 307 87 361Q105 399 142 390Q177 379 173 334Q172 301 148 279Z" fill="#fffaf1"/>
      <path d="M66 166L77 107L116 148M160 147L193 117L201 175" fill="#d79755" {...line}/>
      <path d="M78 144L82 121L99 145M171 148L188 129L190 154" fill="#eda9ae"/>
      <path d="M45 208Q44 153 96 146Q153 135 187 162Q215 183 209 225Q208 264 167 276Q112 292 71 269Q43 254 45 208Z" fill="#d9934e" {...line}/>
      <path d="M49 232Q66 211 91 219Q116 224 124 226Q143 213 171 222Q195 225 207 242Q195 272 162 277Q81 289 49 249Z" fill="#fffaf1"/>
      <ellipse cx="76" cy="239" rx="10" ry="6" fill="#e9acb7" opacity=".9"/><ellipse cx="179" cy="239" rx="10" ry="6" fill="#e9acb7" opacity=".9"/>
      <ellipse cx="94" cy="188" rx="8" ry="5" fill="#fff9e8" transform="rotate(-11 94 188)"/><ellipse cx="155" cy="191" rx="8" ry="5" fill="#fff9e8" transform="rotate(12 155 191)"/>
      <ellipse cx="92" cy="213" rx="5" ry="7" fill={ink}/><ellipse cx="153" cy="215" rx="5" ry="7" fill={ink}/>
      <circle cx="91" cy="211" r="1.5" fill="#fffcec"/><circle cx="152" cy="213" r="1.5" fill="#fffcec"/>
      <path d="M116 236Q122 229 130 236Q126 243 121 241Z" fill={ink}/>
      <path d="M123 241v5q-5 8-13 2m13-2q6 10 13 0" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M86 278Q125 289 166 278" fill="none" stroke="#b95559" strokeWidth="4"/>
      <circle cx="126" cy="289" r="5" fill="#e6cb68" stroke={ink} strokeWidth="1.5"/>
    </g>
    <g transform={`translate(0 ${Math.sin(frame/21)*3})`}><Heart x={43} y={134} size={11}/><Heart x={196} y={89} size={7} fill="#efb5c3"/></g>
  </>;
}

function DrawMascot({frame=0,sunglasses=false,happy=true,cheeks=true,raised=true}: {frame?:number;sunglasses?:boolean;happy?:boolean;cheeks?:boolean;raised?:boolean}) {
  const swing=Math.sin(frame/8)*5;
  return <g transform={`rotate(${Math.sin(frame/11)*3} 90 92)`}>
    {raised?<><path d={`M39 67Q24 61 ${20+swing} 33M135 69Q158 62 ${163-swing} 31`} fill="none" stroke={ink} strokeWidth="13" strokeLinecap="round"/>
    <path d={`M39 67Q24 61 ${20+swing} 33M135 69Q158 62 ${163-swing} 31`} fill="none" stroke="#c76e55" strokeWidth="8" strokeLinecap="round"/>
    <circle cx={20+swing} cy="30" r="10" fill="#ce7559" {...line}/><circle cx={163-swing} cy="29" r="10" fill="#ce7559" {...line}/></>:<path d="M35 85H22v13h14M135 87h14v12h-14" fill="#c76e55" {...line}/>}
    <path d="M56 113l-1 23h11l3-24M119 113l3 22h11l-4-26" fill="#ce7559" {...line}/>
    <path d="M67 114v20h11v-22M111 113l2 21h11l-3-25" fill="#ce7559" {...line}/>
    <path d="M34 50L139 54L135 119L37 116Z" fill="#c66e58" {...line} strokeWidth="3.4"/>
    <path d="M42 58l16 .7" stroke="#df9b80" strokeWidth="2.3" strokeLinecap="round" opacity=".7"/>
    <path d="M37 115L137 117" stroke="#a85344" strokeWidth="1.1" opacity=".6"/>
    {Array.from({length:18}).map((_,i)=><path key={i} d={`M${42+i*5} 110l${Math.min(20,130-(42+i*5))} -${Math.min(20,130-(42+i*5))}`} stroke="#ab564a" strokeWidth=".7" opacity=".23"/>)}
    {cheeks&&<><ellipse cx="58" cy="95" rx="8" ry="4.5" fill="#df8b9b"/><ellipse cx="116" cy="96" rx="8" ry="4.5" fill="#df8b9b"/></>}
    {sunglasses?<><path d="M56 72h63l-4 14q-16 6-22-9q-6 16-24 10Z" fill="#231f1d" stroke={ink} strokeWidth="2"/><path d="M68 77l5-4m-1 7 6-6m23 4 5-5m-1 7 5-6" stroke="#f6f0e4" strokeWidth="1.5"/></>:happy?<><path d="M72 82q5-11 11 0M101 83q5-11 11 0" fill="none" stroke={ink} strokeWidth="3.7" strokeLinecap="round"/></>:<><ellipse cx="76" cy="80" rx="4" ry="7" fill={ink}/><ellipse cx="106" cy="81" rx="4" ry="7" fill={ink}/><circle cx="76" cy="78" r="1.2" fill="#f8edcf"/><circle cx="106" cy="79" r="1.2" fill="#f8edcf"/></>}
  </g>;
}

export const MascotArt: React.FC<{frame?:number;sunglasses?:boolean;happy?:boolean;cheeks?:boolean;raised?:boolean}> = (props) => <svg width="100%" height="100%" viewBox="0 0 180 150" style={{overflow:'visible'}}><DrawMascot {...props}/></svg>;

function Dance({frame,final,flashy,id}: {frame:number;final:boolean;flashy:number;id:string}) {
  const saturation=Math.max(0,Math.min(1,flashy));
  const horizon=final?250:270;
  const floorRows=[0,.07,.17,.31,.5,.75,1];
  const floorPoint=(u:number,t:number)=>[120+u*(14+134*t),horizon+(400-horizon)*t];
  return <>
    <defs>
      <linearGradient id={`${id}-dance-sky`} x2="0" y2="1"><stop stopColor={saturation>.6?'#8656cc':'#766baa'}/><stop offset=".55" stopColor={saturation>.6?'#db53cf':'#b47daf'}/><stop offset="1" stopColor={saturation>.6?'#f04ad6':'#cb8eb5'}/></linearGradient>
      <radialGradient id={`${id}-dance-spot`}><stop stopColor="#d9e5ef" stopOpacity=".45"/><stop offset="1" stopColor="#d9e5ef" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-dance-yellow`}><stop stopColor="#ecd46a" stopOpacity=".65"/><stop offset="1" stopColor="#dfcc7f" stopOpacity="0"/></radialGradient>
      <clipPath id={`${id}-mirror-clip`}><circle cx="120" cy="69" r="24"/></clipPath>
    </defs>
    <rect width="240" height="400" fill={`url(#${id}-dance-sky)`}/>
    <path d="M118 72L-15 268H10L123 72L67 269H99L123 72L174 269H202L123 72L255 220V200Z" fill="#ddd5ea" opacity=".10"/>
    <circle cx={48+Math.sin(frame/30)*10} cy="137" r="28" fill={`url(#${id}-dance-spot)`}/><circle cx="178" cy="154" r="17" fill={`url(#${id}-dance-spot)`}/>
    <rect x="0" y={horizon} width="240" height={400-horizon} fill="#30395f"/>
    {floorRows.slice(0,-1).map((t,row)=>Array.from({length:12}).map((_,col)=>{
      const u=(col-6)/6,u2=(col-5)/6,t2=floorRows[row+1];
      const p=[floorPoint(u,t),floorPoint(u2,t),floorPoint(u2,t2),floorPoint(u,t2)];
      const colors=['#6873b1','#334565','#8a7baf','#8cc0bd','#c7c887','#b491b1'];
      const color=(col+row)%2===0?'#424b7e':colors[(col*7+row*3)%colors.length];
      return <polygon key={`${row}-${col}`} points={p.map(v=>v.join(',')).join(' ')} fill={color} opacity=".85"/>;
    }))}
    <path d={`M0 ${horizon}H240`} stroke="#302c41" strokeWidth="2.5"/>
    <circle cx="20" cy="328" r="25" fill={`url(#${id}-dance-spot)`}/><circle cx="206" cy="354" r="26" fill={`url(#${id}-dance-spot)`}/><circle cx="168" cy="302" r="25" fill={`url(#${id}-dance-yellow)`}/>
    <path d="M120 0V44" stroke={ink} strokeWidth="2.2"/>
    <g clipPath={`url(#${id}-mirror-clip)`}>
      <circle cx="120" cy="69" r="25" fill="#aaa8d1"/>
      {Array.from({length:5}).map((_,row)=>Array.from({length:6}).map((__,col)=><rect key={`${row}-${col}`} x={93+col*9} y={45+row*10} width="9" height="10" fill={['#d2d4e2','#f5f1df','#9e9bd0','#ece6c8','#cec864','#b8b5d8'][(row*3+col)%6]} stroke="#8c88a3" strokeWidth=".65"/>))}
      <path d="M109 44Q99 67 109 94M128 44Q142 69 128 95" fill="none" stroke="#7d7993" strokeWidth=".8"/>
    </g>
    <circle cx="120" cy="69" r="24" fill="none" {...line} strokeWidth="2.5"/>
    <Spark x={104} y={53} size={5}/>
    <g transform={final?'translate(45 144) scale(.95 1.02)':`translate(29 206) scale(1.03)`}><DrawMascot frame={frame}/></g>
    {final ? <>
      <Spark x={21} y={97} size={13}/><Spark x={59} y={49} size={8}/><Spark x={32} y={333} size={5}/><Spark x={222} y={362} size={8}/><Spark x={86} y={250} size={8} color="#efd770"/><Spark x={101} y={32} size={4} color="#efd770"/>
      <text x="19" y="155" transform="rotate(-4 110 145)" fontFamily="'Long Cang', 'LongCang', cursive" fontSize="47" fontWeight="bold" fill="#edcb66" stroke="#2d2622" strokeWidth="9" paintOrder="stroke" strokeLinejoin="round">拿捏了!</text>
      <g transform="translate(211 73)">
        <circle r="16" fill="#ce7760" stroke="#fff4e8" strokeWidth="2.6"/><ellipse cx="-5" cy="-2" rx="2.2" ry="4" fill={ink}/><ellipse cx="4" cy="-2" rx="2.2" ry="4" fill={ink}/>
        <circle cy="16" r="6.5" fill="#e45e69"/><path d="M-3 16h6m-3-3v6" stroke="white" strokeWidth="1.6"/>
      </g>
      <Heart x={211} y={120} size={10}/><text x="211" y="145" fill="white" stroke={ink} strokeWidth="2" paintOrder="stroke" fontFamily="'Long Cang', serif" fontSize="14" textAnchor="middle">10.2w</text>
      <path d="M203 163h16q5 0 5 5v7q0 5-5 5h-8l-7 4 1-5q-6 0-6-5v-6q0-5 4-5Z" fill="#f9f7e8" stroke={ink} strokeWidth="1.8"/><path d="M204 171h1m6 0h1m5 0h1" stroke={ink} strokeWidth="2.5" strokeLinecap="round"/>
      <text x="211" y="198" fill="white" stroke={ink} strokeWidth="2" paintOrder="stroke" fontFamily="'Long Cang', serif" fontSize="14" textAnchor="middle">2333</text>
      <path d="M198 230q4-16 16-18v-6l13 10-14 11v-6q-9 0-15 9Z" fill="#fff8ee" stroke={ink} strokeWidth="1.8"/>
      <text x="211" y="246" fill="white" stroke={ink} strokeWidth="2" paintOrder="stroke" fontFamily="'Long Cang', serif" fontSize="14" textAnchor="middle">分享</text>
      <text x="11" y="377" fill="#fff9e8" stroke="#353041" strokeWidth="2.2" paintOrder="stroke" fontFamily="'Long Cang', 'LongCang', cursive" fontWeight="bold" fontSize="15">@小克 · Opus 5.5</text>
      <text x="11" y="394" fill="#fff9e8" stroke="#353041" strokeWidth="1.8" paintOrder="stroke" fontFamily="'Long Cang', 'LongCang', cursive" fontSize="12">#AI剪辑 #卡点 #code2video</text>
    </> : <>
      <Spark x={211} y={123} size={4} opacity={.65+.3*Math.sin(frame/8)}/><Spark x={46} y={355} size={5}/><Spark x={167} y={330} size={5}/>
    </>}
  </>;
}

/** All scene motion derives from the supplied Remotion frame, so renders are repeatable. */
export const SceneArt: React.FC<SceneArtProps> = ({kind, frame=0, final=false, flashy=0, zoom=1}) => {
  const id = React.useId().replace(/:/g, '');
  return (
  <svg width="100%" height="100%" viewBox="0 0 240 400" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
    <g transform={`translate(${120*(1-zoom)} ${200*(1-zoom)}) scale(${zoom})`}>
      {kind==='city'?<City frame={frame} id={id}/>:kind==='ramen'?<Ramen frame={frame} id={id}/>:kind==='dog'?<Dog frame={frame} id={id}/>:<Dance frame={frame} final={final} flashy={flashy} id={id}/>}
    </g>
  </svg>
);
};
