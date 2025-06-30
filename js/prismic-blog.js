import { createClient } from "https://cdn.skypack.dev/@prismicio/client";

const repo = 'https://drpedrocasavechiablog.cdn.prismic.io/api/v2';
const client = createClient(repo);
const blogs = await client.getAllByType('blog_post');

blogs.forEach(blog => {
    
    const uid = blog.uid;
    const title = blog.data.title[0].text;
    const date = Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(blog.data.date));
    const image = blog.data.thumb_image?.url;
    
    const posts = document.getElementById('posts');

    const article = document.createElement('li')
    article.className = 'grid-item wow animate__fadeIn'
    article.innerHTML = `
        <div class="blog-post">
            <div class="blog-post-image bg-fast-blue">
                <a href=blog/${uid}><img src=${image} alt=""></a>
            </div>
            <div class="post-details bg-white text-center padding-3-rem-all xl-padding-2-rem-all">
                <a href=blog/${uid} class="blog-category text-fast-blue margin-15px-bottom text-medium font-weight-500 letter-spacing-1px text-uppercase">Artigo</a>
                <a href=blog/${uid} class="alt-font text-extra-dark-gray text-extra-dark-gray-hover text-large line-height-26px d-block margin-20px-bottom">${title}</a>
                <a href=blog/${uid} class="alt-font text-uppercase text-extra-small letter-spacing-1px d-block">${date}</a>
            </div>
        </div>
    `
    posts.appendChild(article)

    const $newItem = $(article);

    window.blogGrid.isotope('appended', $newItem).isotope('layout');
});