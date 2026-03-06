const rssFeedsB = [

{
url: "https://timesofindia.indiatimes.com/rssfeeds/-2128816011.cms",
source: "ToI - Hyderabad"
},

{
url: "https://www.thehindu.com/feeder/default.rss",
source: "The Hindu - Home"
},

{
url: "https://www.oneindia.com/rss/feeds/news-india-fb.xml",
source: "OneIndia - Top Stories"
},

{
url: "https://telanganatoday.com/feed",
source: "Telangana Today - Hyderabad"
},

{
url: "https://www.aninews.in/rss/feed/category/national.xml",
source: "ANI - National"
}

];

async function loadRSS_B(){

try{

const allItems=[];

for(let feed of rssFeedsB){

const apiUrl=`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;

const response=await fetch(apiUrl);

const data=await response.json();

if(data.items){

data.items.forEach(item=>{
item.sourceName=feed.source;
});

allItems.push(...data.items);

}

}

const now=Date.now();
const twelveHours=12*60*60*1000;

const recentItems=allItems.filter(item=>{

const pubTime=new Date(item.pubDate).getTime();

return(now-pubTime)<=twelveHours;

});

renderArticlesB(recentItems);

}

catch(error){

document.getElementById("rss-readerb").innerHTML="Error loading feeds.";

}

}

function renderArticlesB(items){

const container=document.getElementById("rss-readerb");

container.innerHTML="";

if(!items.length){

container.innerHTML="No articles found.";

return;

}

items.forEach(item=>{

const card=document.createElement("div");

card.className="rss-card";

const imageHTML=getImageB(item);

card.innerHTML=`

<div class="rss-content">

<div class="rss-image">
${imageHTML}
</div>

<span class="source-badge">${item.sourceName}</span>

<div class="pub-date">${formatDateB(item.pubDate)}</div>

<h2>${item.title}</h2>

<p>${cleanDescriptionB(item.description)}</p>

<a href="${item.link}" target="_blank" class="read-link">
Read Full Article
</a>

</div>

`;

container.appendChild(card);

});

}

function getImageB(item){

if(item.enclosure && item.enclosure.link){

return `<img src="${item.enclosure.link}" alt="news image"
onerror="this.src='Latest-News.jpg'">`;

}

if(item.description && item.description.includes("<img")){

const match=item.description.match(/<img[^>]+src="([^">]+)"/);

if(match && match[1]){

return `<img src="${match[1]}" alt="news image"
onerror="this.src='Latest-News.jpg'">`;

}

}

return `<img src="Latest-News.jpg" alt="default news image">`;

}

function cleanDescriptionB(description){

return description ? description.replace(/<img[^>]*>/g,"") : "";

}

function formatDateB(dateStr){

if(!dateStr) return "";

const now=new Date();

const date=new Date(dateStr+" UTC");

const diff=Math.floor((now-date)/1000);

const minutes=Math.floor(diff/60);
const hours=Math.floor(diff/3600);
const days=Math.floor(diff/86400);

if(diff<60) return "Just now";
if(minutes<60) return minutes+" min ago";
if(hours<24) return hours+" hr ago";
if(days===1) return "Yesterday";
if(days<7) return days+" days ago";

return date.toLocaleDateString("en-IN",{
day:"numeric",
month:"short"
});

}

loadRSS_B();