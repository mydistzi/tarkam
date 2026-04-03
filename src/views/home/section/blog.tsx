import { useEffect, useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import SEO from '@/components/SEO';

interface BlogsProps {
    blogs: {
        id?: number;
        slug?: string;
        title: string;
        content: string;
        image?: string;
        image_alt?: string;
        category?: { name?: string };
        created_at: string;
        author: string;
    }[];
}

function Blogs({ blogs }: BlogsProps) {
    const [activeBlogIndex, setActiveBlogIndex] = useState<number | null>(null);

    const handleOpenModal = (index: number) => {
        setActiveBlogIndex(index);
    };

    const handleCloseModal = () => {
        setActiveBlogIndex(null);
    };

    useEffect(() => {
        const onHidden = () => setActiveBlogIndex(null);
        document.addEventListener('hidden.bs.modal', onHidden);
        return () => document.removeEventListener('hidden.bs.modal', onHidden);
    }, []);

    return (
        <div className="zethblogsaits" id="blogTarkam">
            <div className="zethblogsaits-grids">

                <h3>{`Latest Blogs & News`}</h3>
                {blogs.map((blog, index) => (
                    <div key={`blog-${blog.id || index}`} className={`col-md-3 zethblogsaits-grid zethblogsaits-grid-${index}`}>
                        <a
                            href="#"
                            data-toggle="modal"
                            data-target={`#myModal${index}`}
                            onClick={() => handleOpenModal(index)}
                        >
                            <img src={blog.image} alt={blog.image_alt} />
                        </a>
                        <span className="dsdate">{blog.created_at} </span>
                        {blog.author && <span className="author">By {blog.author}</span>}
                        <h4>
                            <a
                                href="#"
                                data-toggle="modal"
                                data-target={`#myModal${index}`}
                                onClick={() => handleOpenModal(index)}
                            >
                                {blog.title}
                            </a>
                        </h4>
                        <p>{blog.content}</p>
                        <button
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target={`#myModal${index}`}
                            onClick={() => handleOpenModal(index)}
                        >
                            {`READ MORE`}
                            <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                ))}
                <div className="clearfix"></div>
            </div>

            <div className="tooltip-content">
                {blogs.map((blog, index) => (
                    <div key={`modal-${blog.id || index}`} className="modal fade details-modal" id={`myModal${index}`} tabIndex={-1} role="dialog" aria-hidden="true">
                        <SEO
                            title={blog.title}
                            description={blog.content?.substring(0, 160) || `Read ${blog.title} on Tarkam`}
                            image={blog.image}
                            type="article"
                            author={blog.author}
                            publishedTime={blog.created_at}
                            modifiedTime={blog.created_at}
                            keywords={["gaming", "blog", blog.title?.toLowerCase() || ""]}
                            articleSection="Gaming"
                            articleTag={[blog.category?.name || "gaming"]}
                        />
                        <div className="modal-dialog modal-lg modal-fixed" role="document">
                            <div className="modal-content modal-fixed-content">
                                <div className="modal-header modal-fixed-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-hidden="true"
                                        onClick={handleCloseModal}
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">{blog.title}{blog.category?.name ? ` - ${blog.category.name}` : ''}</h4>
                                </div>
                                <div className="modal-body modal-fixed-body">
                                    <div className="row">
                                        <div className="col-md-6 modal-content-left">
                                            <img src={blog.image} alt={blog.image_alt} className="img-responsive" />
                                            <div className="blog-content-scroll">
                                                <p className="mt-2">{blog.content}</p>
                                            </div>
                                        </div>

                                        <div className="col-md-6 modal-content-right">
                                            <div className="comments-section comments-section-scroll">
                                                {activeBlogIndex === index && (
                                                    <>
                                                        <CommentCount
                                                            shortname="tarkam"
                                                            config={{
                                                                url: `${window.location.origin}${window.location.pathname}?post=${blog.slug ?? blog.id ?? index}`,
                                                                identifier: `blog-${blog.slug ?? blog.id ?? index}`,
                                                                title: blog.title,
                                                            }}
                                                        >
                                                            {/* Placeholder Text */}
                                                            Comments
                                                        </CommentCount>
                                                        <DiscussionEmbed
                                                            key={`disqus-${blog.id ?? index}`}
                                                            shortname="tarkam"
                                                            config={{
                                                                url: `${window.location.origin}${window.location.pathname}?post=${blog.slug ?? blog.id ?? index}`,
                                                                identifier: `blog-${blog.slug ?? blog.id ?? index}`,
                                                                title: blog.title,
                                                                language: 'en_US',
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Blogs;
