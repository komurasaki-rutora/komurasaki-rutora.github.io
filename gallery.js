/*
作品の登録例：
{ title: "春のファンアート", category: "fanart", src: "images/fanart-01.png", alt: "春衣装の小紫流虎" },
画像ファイルを images フォルダに入れ、src を実際のファイル名に変更してください。
category: fanart / copyright / original / gift
*/
const imageFiles = [
  // ファンアート
  "fanart/fanart_1_○○様.png",
  "fanart/fanart_2_△△様.png",
  "fanart/fanart_3_□□様.png",

  // 版権イラスト
  "copyright/copyright_1_作品名.png",
  "copyright/copyright_2_作品名.png",

  // 自身のイラスト＆創作
  "original/original_1_創作タイトル.png",

  // みんなが描いてくれた自分のファンアート
  "gift/gift_1_○○様.png",
];

const artworks = imageFiles
  .map((path) => {
    const filename = path.split("/").pop();

    const match = filename.match(
      /^(fanart|copyright|original|gift)_(\d+)_(.+)\.(png|jpe?g|webp)$/i
    );

    if (!match) {
      console.warn("ファイル名を確認してください:", path);
      return null;
    }

    const [, category, order, title] = match;

    return {
      title,
      category: category.toLowerCase(),
      order: Number(order),
      src: `images/${path}`,
      alt: title,
    };
  })
  .filter((art) => art !== null)
  .sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    // 数字が大きいものを上に表示
    return b.order - a.order;
  });
];
const descriptions = {
  fanart: "小紫流虎が描いたファンアートを掲載しています。",
  copyright: "好きな作品のキャラクターなど、版権イラストを掲載しています。",
  original: "自身で描いたイラストやオリジナル創作を掲載しています。",
  gift: "みなさんが描いてくださった、小紫流虎のファンアートです。"
};
const grid=document.querySelector("#grid"), empty=document.querySelector("#empty"), description=document.querySelector("#description");
const viewer=document.querySelector("#viewer"), largeImage=document.querySelector("#large-image"), caption=document.querySelector("#caption");
const tabs=[...document.querySelectorAll(".tabs button")];
let visible=[], index=0, focusBefore=null;
document.querySelector("#year").textContent=new Date().getFullYear();
function render(category){
  visible=artworks.filter(a=>a.category===category);
  description.textContent=descriptions[category];
  tabs.forEach(t=>t.classList.toggle("active",t.dataset.category===category));
  grid.replaceChildren(); empty.hidden=visible.length>0;
  visible.forEach((art,i)=>{
    const button=document.createElement("button");button.className="art";button.type="button";button.setAttribute("aria-label",(art.title||"イラスト")+"を拡大表示");
    const img=document.createElement("img");img.src=art.src;img.alt=art.alt||art.title||"";img.loading="lazy";
    const label=document.createElement("span");label.textContent=art.title||"イラスト";
    button.append(img,label);button.addEventListener("click",()=>openViewer(i));grid.append(button);
  });
}
function openViewer(i){if(!visible.length)return;index=i;focusBefore=document.activeElement;updateViewer();viewer.classList.add("open");viewer.setAttribute("aria-hidden","false");document.body.classList.add("lock");document.querySelector("#close").focus();}
function updateViewer(){const a=visible[index];largeImage.src=a.src;largeImage.alt=a.alt||a.title||"";caption.textContent=a.title||"";document.querySelector("#prev").hidden=visible.length<2;document.querySelector("#next").hidden=visible.length<2;}
function closeViewer(){viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true");document.body.classList.remove("lock");largeImage.src="";if(focusBefore)focusBefore.focus();}
function move(d){if(visible.length<2)return;index=(index+d+visible.length)%visible.length;updateViewer();}
tabs.forEach(t=>t.addEventListener("click",()=>render(t.dataset.category)));
document.querySelector("#close").addEventListener("click",closeViewer);
document.querySelector("#prev").addEventListener("click",()=>move(-1));
document.querySelector("#next").addEventListener("click",()=>move(1));
viewer.addEventListener("click",e=>{if(e.target===viewer)closeViewer();});
document.addEventListener("keydown",e=>{if(!viewer.classList.contains("open"))return;if(e.key==="Escape")closeViewer();if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);});
render("fanart");
