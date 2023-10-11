import Footer from '../../components/layouts/Footer';
import HeaderInner from '../../components/layouts/HeaderInner';
import posts from '../../data/Posts.json';
import Link from 'next/link';
import Image from 'next/image';
export default function Template() {
  return (
    
        <>		
        <HeaderInner/>
            <div class="uk-margin-top uk-margin-large-top@m">
                <div class="uk-container">
                    <div id="blog-list-container" class="uk-grid uk-grid-row-large@m uk-grid-match" data-uk-grid="">
                            <div class="uk-width-1-1 uk-first-column">
                                <article class="post featured-post uk-card">
                                   
                                    {posts.map((blog, index) => {
                                    return (
                                        <div key={index}>
                                            <div class="uk-grid uk-grid-match uk-flex-between" data-uk-grid="">
                                                <div class="uk-width-8-12@m uk-first-column">
                                                    <div class="featured-image uk-card-media-left uk-panel uk-overflow-hidden uk-radius">
                                                        <canvas width="800" height="480"></canvas>
                                                        <img src={`/images/posts/${blog.image}`} alt="Pixel Kit: thinking inside the box for a change" class="uk-cover" data-uk-cover="" loading="lazy" />  <Link href={`/blog/${blog.slug}`} aria-label="Title" class="uk-position-cover"></Link>
                                                    </div>
                                                </div>
                                                <div class="uk-width-4-12@m">
                                                    <div class="uk-flex-column uk-flex-between">
                                                        <div class="uk-panel">
                                                            <ul class="uk-subnav uk-subnav-small uk-subnav-dot uk-text-small uk-text-muted">
                                                                <li><a class="uk-text-bold uk-text-primary uk-text-capitalize" href="#0">{blog.category}</a></li>
                                                                <li><span>{blog.publishedDate}</span></li>
                                                            </ul>
                                                          
                                                            <Link href={`/blog/${blog.slug}`} aria-label="Title">
                                                            <h2 class="uk-h4 uk-h3@m">{blog.title ? blog.title : 'UI vs. UX: What’s the difference?'}</h2>
                                                            </Link>
                                                              
                                                            <p class="uk-margin-remove-top uk-text-muted">{blog.description}</p>
                                                        </div>
                                                        <div class="uk-grid-xsmall uk-flex-middle uk-margin-top uk-grid" data-uk-grid="">
                                                            <div class="uk-width-auto uk-first-column">
                                                                <div class="uk-panel uk-overflow-hidden uk-border-circle">
                                                                    
                                                                    <Image src={`/images/posts/${blog.authorImg}`} alt="Bruno Texira" class="uk-cover" loading="lazy" width={48} height={48}/>
                                                                </div>
                                                            </div>
                                                            <div class="uk-width-expand">
                                                                <div class="uk-panel">
                                                                    <h4 class="uk-h6 uk-margin-remove">{blog.author}</h4>
                                                                    <p class="uk-text-meta dark:uk-text-gray-60 uk-margin-remove">{blog.authordeg}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }).slice(0, 1)}
                                </article>
                                {posts.map((blog, index) => {
                                    return (
                                        <div class="uk-width-1-3@m uk-grid-margin" key={index}>
                                            <article class="post featured-post gap-middle uk-card">
                                                <div class="featured-image uk-panel uk-overflow-hidden uk-radius">
                                                    <canvas width="460" height="300"></canvas>
                                                    <Image src={`/images/posts/${blog.image}`} alt="Delbo x Diplo to release NFT for Justice Charity" class="uk-cover" data-uk-cover="" loading="lazy" width={460} height={300} /> <Link href={`/blog/${blog.slug}`} aria-label="Delbo x Diplo to release NFT for Justice Charity"  class="uk-position-cover"></Link>
                                                </div>
                                                <div class="uk-panel uk-padding-top">
                                                    <ul class="uk-subnav uk-subnav-small uk-subnav-dot uk-text-small uk-text-muted dark:uk-text-gray-40">
                                                        <li><a class="uk-text-bold uk-text-primary uk-text-capitalize" href="#0">{blog.category}</a></li>
                                                        <li><span>{blog.publishedDate}</span></li>
                                                    </ul>
                                                    <h2 class="uk-h5 uk-h4@m">
                                                        <Link class="uk-link-reset" href={`/blog/${blog.slug}`}>{blog.title}</Link>
                                                    </h2>
                                                    <p class="uk-margin-remove-top uk-text-muted">{blog.description}</p>
                                                </div>
                                            </article>
                                        </div>
                                        )
                                }).slice(1, 7)}
                            </div>                           
                    </div>
                </div>
            </div>
        <Footer/>
        </>
        
  	);
}
