import { createClient } from "https://cdn.skypack.dev/@prismicio/client";

const repo = 'https://drpedrocasavechiablog.cdn.prismic.io/api/v2';
const client = createClient(repo);
const blogs = await client.getByUID('blog_post', 'como-restaurar-seu-corpo-depois-da-gravidez');

console.log('Dados da API PRISMIC:', blogs);