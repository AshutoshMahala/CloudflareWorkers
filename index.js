const html =`
<!DOCTYPE html>
<html>

<head>
    <script src="jquery-1.12.4.min.js"></script>
    <style>
        body {
            background-color: aquamarine;
        }

        /* .tile { 
                background-color: aliceblue;
                
            } */
        .overlay1 {
            align-self: center;
            align-content: center;
            top: 2rem;
            width: 50rem;
            height: 15rem;
            background-color: rgba(0, 0, 0, 0.30);
            backdrop-filter: blur(5px);
            margin: 0 auto;
            z-index: 0;
        }

        .overlay2 {
            align-self: center;
            display: block;
            top: 20rem;
            width: 50rem;
            height: 50rem;
            background-color: rgba(0, 0, 0, 0.30);
            backdrop-filter: blur(5px);
            margin: 0 auto;
            margin-top: 1rem;
            z-index: 0;
        }

        .databox {
            position: relative;
            display: block;
            height: 1rem;
            width: 15rem;
            /* float: center; */
        }
        .form1{
            position: relative;
            align-self: center;
            align-content: center;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 1);
            backdrop-filter: blur(5px);
            border-radius: 1rem;
            top: 2rem;
            height: 10rem;
            width: 20rem;
        }
        .form-tile{
            position: relative;
            align-self: center;
            text-align: center;
            margin: 1rem;
            margin-top: 1rem;
            /* background-color: rgba(255, 255, 255, 1);
            backdrop-filter: blur(5px);
            border-radius: 1rem;
            height: auto;
            width: auto; */
        }
        .first{
            padding-top: 1rem;
        }
        .form-button{
            position: relative;
            align-self: center;
            text-align: center;
            margin: 0 auto;

        }

        .worker-tile{
            position: relative;
            align-self: center;
            text-align: center;
            margin: 0 auto;
        }
    </style>
</head>

<body>
    <div class="overlay1">
        <!-- <div class="form1"> -->
            <!-- <div class="form1">

            </div> -->
            <div class="form1">
                <div class="form-tile first">
                    <label>Press Links</label>
                </div>
                <div class="form-button">
                    <button onclick="GetLinks()" >Get Links</button>
                </div>
                <div id="links">
                </div>
            </div>
        <!-- </div> -->
    </div>
</body>
<script>
    function GetLinks (){

        let response = httpGet("/links");
        console.log(response)
        let urlsStr = JSON.stringify(response)
        // console.log(urlsStr)
        // urlsStr = urlsStr.replace("\\","\\\\")

        let urljson = JSON.parse(urlsStr)
        // console.log(urljson)
        let gig = JSON.parse(urljson)

        let list = document.getElementById("links")
        while (list.hasChildNodes()) {  
          list.removeChild(list.firstChild);
        }
        // let urls = [
        //     {"name": "worker1", "url": "example.com/worker/1"},
        //     {name: "worker2", url: "example.com/worker/2"},
        //     {name: "worker3", url: "example.com/worker/3"}
        // ]
    gig.forEach( async link => {
        document.getElementById("links").appendChild(getTile(link))
    })
    }

    function toTile(urls){
      console.log(typeof urls)
      JSON.parse(urls).forEach( async link => {
        document.getElementById("links").appendChild(getTile(link))
    })
    }

    function getTile(link){
        var tileDiv = document.createElement("div")
        tileDiv.classList.add("worker-tile")
        tileDiv.innerHTML = \`<a href="\${link.url}">\${link.name}</a>\`
        return tileDiv
    }

    function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
</script>
</html>
`

const urls = [
  {name: "worker1", url: "example.com/worker1"},
  {name: "worker2", url: "example.com/worker2"},
  {name: "worker3", url: "example.com/worker3"}
]

const workerhtml =`
<!DOCTYPE html>
<html>
<head></html>
<body>
<h1>Worker Page</h1>
<span id="worker-name">You have landed on worker<span>
<button href="/">Go Back</button>
</body>
</html>
`

class LinksTransformer {
  constructor(name) {
    this.name = name;
  }
  
  async element(element) {
    element.setInnerContent(`you are talking to ${this.name}`);
  }
}

function urlToString(link){
  return `name: "${link.name}", url: "${link.url}"`
}

function urlsToString(links){
  let lst = []
  links.forEach(element => {
    lst.concat(urlToString(element))
  });
  return lst
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let url = request.url.split("/")
  let urlsStr = urlsToString(urls)
  console.log(urlsStr)
  if(url.length>3 && url[3]==='links'){
    return new Response(`[{"name":"worker1","url":"example.com/worker/1"},{"name":"worker2","url":"example.com/worker/2"},{"name":"worker3","url":"example.com/worker/3"}]`, {
      headers: { 'content-type': 'text/json' },
    })
  }else if(url.length>3 && url[3]==='worker'){
    const rewriter = new HTMLRewriter()
                    .on('#worker-name', new LinksTransformer(url[4]));
    return rewriter.transform(
      new Response(workerhtml, {
        headers: { 'content-type': 'text/html' },
      })
    );
  }
  return new Response(html, {
    headers: { 'content-type': 'text/html' },
  })
}
