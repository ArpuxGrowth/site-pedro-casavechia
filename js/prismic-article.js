import { createClient } from "https://cdn.skypack.dev/@prismicio/client";

const repo = 'https://drpedrocasavechiablog.cdn.prismic.io/api/v2';
const client = createClient(repo);

// Start -> Get URL Params
const urlParams = new URLSearchParams(window.location.search);

const uid = urlParams.get("uid");
// End -> Get URL Params

// Start -> Article content
const article = await client.getByUID('blog_post', uid);

const title = article.data.title[0]?.text || 'Título não encontrado';
const date = Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(article.data.date));
const coverImg = article.data.cover_image?.url;
const content = article.data.content;

document.title = title + ' – Dr. Pedro Casavechia';

const post = document.getElementById('post');

function renderContent(contentArray) {
  let html = '';
  let inList = false;

  for (const block of contentArray) {
    switch (block.type) {
      case 'list-item':
        if (!inList) {
          html += '<ul class="margin-25px-bottom">';
          inList = true;
        }
        html += `<li>${block.text}</li>`;
        break;

      default:
        if (inList) {
          html += '</ul>';
          inList = false;
        }

        if (block.type === 'paragraph') {
          html += `<p>${block.text}</p>`;
        } else if (block.type.startsWith('heading')) {
          const level = block.type.slice(-1);
          html += `<h${level} class="alt-font font-weight-400 text-extra-dark-gray">${block.text}</h${level}>`;
        }
        break;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

post.innerHTML = `
    <ul class="list-unstyled margin-2-rem-bottom">
        <li class="d-inline-block align-middle margin-25px-right"><i class="feather icon-feather-calendar text-fast-blue margin-10px-right"></i><a href="#">${date}</a></li>
        <li class="d-inline-block align-middle margin-25px-right"><i class="feather icon-feather-folder text-fast-blue margin-10px-right"></i><a href="#">Artigo</a></li>
        <li class="d-inline-block align-middle"><i class="feather icon-feather-user text-fast-blue margin-10px-right"></i>Por <a href="#">Pedro Casavechia</a></li>
    </ul>
    <h5 class="alt-font font-weight-500 text-extra-dark-gray margin-4-half-rem-bottom">${title}</h5>
    <img src="${coverImg}" alt="" class="w-100 border-radius-6px margin-4-half-rem-bottom">
    ${renderContent(content)}
`
// End -> Article content

// Start -> Latest posts
const blogs = await client.getAllByType('blog_post');
const slice = blogs.slice(0, 3);

slice.forEach((blog, i) => {
    const uid = blog.uid;
    const title = blog.data.title[0]?.text.length > 55 ? blog.data.title[0]?.text.slice(0, 52) + '...' : blog.data.title[0]?.text || 'Título não encontrado';
    const date = Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(blog.data.date));
    const latestImg = blog.data.latest_image?.url;
    const delay = 0.2 * (i + 1);
    
    const latestPosts = document.getElementById('latest-posts');

    const li = document.createElement('li');
    li.classList = 'd-flex wow animate__fadeIn';
    li.setAttribute('data-wow-delay', `${delay}s`);
    li.innerHTML = `
        <figure class="flex-shrink-0">
            <a href="${uid}"><img class="border-radius-3px" src="${latestImg}" alt=""></a>
        </figure>
        <div class="media-body flex-grow-1">
            <a href="${uid}" class="font-weight-500 text-extra-dark-gray d-inline-block margin-five-bottom md-margin-two-bottom">${title}</a>
            <span class="text-medium d-block line-height-22px">${date}</span>
        </div>
    `

    latestPosts.appendChild(li);
});
// End -> Latest posts

// Start -> Related posts

slice.forEach((blog, i) => {
    const uid = blog.uid;
    const title = blog.data.title[0]?.text.length > 55 ? blog.data.title[0]?.text.slice(0, 52) + '...' : blog.data.title[0]?.text || 'Título não encontrado';
    const date = Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(blog.data.date));
    const thumbImg = blog.data.thumb_image?.url;
    const delay = 0.2 * (i + 1);

    const relatedPosts = document.getElementById('related-posts');

    const li = document.createElement('li');
    li.classList = 'grid-item wow animate__fadeIn';
    li.setAttribute('data-wow-delay', `${delay}s`);
    li.innerHTML = `
        <div class="blog-post">
            <div class="blog-post-image bg-fast-blue">
                <a href="${uid}"><img src="${thumbImg}" alt=""></a>
            </div>
            <div class="post-details bg-white text-center padding-3-rem-all xl-padding-2-rem-all">
                <a href="${uid}" class="blog-category text-fast-blue margin-15px-bottom text-medium font-weight-500 letter-spacing-1px text-uppercase">Artigo</a>
                <a href="${uid}" class="alt-font text-extra-dark-gray text-extra-dark-gray-hover text-large line-height-26px d-block margin-20px-bottom">${title}</a>
                <a href="${uid}" class="alt-font text-uppercase text-extra-small letter-spacing-1px d-block">${date}</a>
            </div>
        </div>
    `
    relatedPosts.appendChild(li);
});

// End -> Related posts