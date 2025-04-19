import React, { useContext, useEffect, useState } from 'react';
import { ReactComponent as PlusIcon } from "../assets/Icons/plus.svg"
import { ReactComponent as TrashIcon } from "../assets/Icons/Trash.svg"
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import SpinnerContext from '../Context/SpinnerContext';
import Loading from '../Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import ToastContext from '../Context/ToastContext';
import LayoutWithHeaderAndFooter from '../Components/Layouts/LayoutWithHeaderAndFooter';
import Footer from '../Sections/Footer/Footer';
import CustomModal from '../Components/Modal/CustomModal';

export const GET_BLOGS = gql`
	query GetAllBlogs($skip: Int, $take: Int) {
        allBlogs(skip: $skip, take: $take) {
            totalCount
            blogs {
                id
                title
                description
                image
                created_at
                updated_at
                created_by
                updated_at
                deleted
                sections{
                    id
                    blogId
                    title
                    content
                    deleted
                    image
                }
            }
        }
    }
`;

export const CREACT_BLOG = gql`
    mutation CreateBlog($data: CreateBlogInput!) {
        createBlog(data: $data) {
            message
            blog {
                id
                title
                created_by
                sections {
                    title
                    blogId
                    content
                    deleted
                    image
                    
                }
            }
        }
    }
`
export const DELETE_BLOG = gql`
    mutation DeleteBlog($id: Float!) {
        deleteBlog(id: $id) {
            id
        }
    }
`

const Blog: React.FC = () => {


    const [createBlog] = useMutation(CREACT_BLOG);
    const [deleteBlog, { data: dataAfterDelte }] = useMutation(DELETE_BLOG);
    const [getBlogs, { data: getBlogsData, loading, error }] = useLazyQuery(GET_BLOGS, {
        variables: { skip: 0, take: 100 },
    });
    const { showSpinner, hideSpinner } = useContext(SpinnerContext);
    const { showToast, hideToast } = useContext(ToastContext);

    const [isComponentInIFrame, setIsComponentInIFrame] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [delteBlogProcessing, setDelteBlogProcessing] = useState<string[]>([])

    const [isOpenModal, setisOpenModal] = useState(false)
    const [selectedBlogId, setselectedBlogId] = useState<any>(null)

    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        if (window.self !== window.top) {
            setIsComponentInIFrame(true)
        } else {
            setIsComponentInIFrame(false)
        }
    }, [])

    useEffect(() => {

        if (loading) {
            showSpinner()
        }
        else {
            hideSpinner()
        }
    }, [loading])

    useEffect(() => {
        if (sessionStorage.getItem("update")) {
            window.location.reload()
            sessionStorage.removeItem("update")
        }
        getBlogs({
            variables: {
                skip: 0, take: 100
            }
        })
    }, [sessionStorage.getItem("update")])



    const createBlogFuc = async () => {
        try {
            setProcessing(true)
            const result = await createBlog({
                variables: {
                    data: {
                        title: "",
                        description: "",
                        image: "",
                        created_by: "",
                        deleted: false,
                        sections: []
                    }
                },
            });
            setProcessing(false)
            navigate(`/blog/edit/${result?.data?.createBlog?.blog?.id}`)
        } catch (error) {
            setProcessing(false)
            console.error("Mutation Error:", error);
        }
    }

    const deleteBlogFunc = async (blogId) => {
        try {
            setDelteBlogProcessing([...delteBlogProcessing, `${blogId}`])
            const result = await deleteBlog({
                variables: {
                    id: blogId
                },
            });
            setisOpenModal(false)
            setDelteBlogProcessing([...delteBlogProcessing.filter((item, _) => { return (item !== blogId) })])
            window.location.reload()
            showToast("Blog deleted successfully!", "success");
            setTimeout(() => {
                hideToast();
            }, 3000);
        } catch (error) {
            setisOpenModal(false)
            setDelteBlogProcessing([...delteBlogProcessing.filter((item, _) => { return (item !== blogId) })])
            console.error("Mutation Error:", error);
            showToast("Blog deletion fail!", "warn");
            setTimeout(() => {
                hideToast();
            }, 3000);
        }
    }

    const Button = ({ title, preIcon, onClick }) => {
        return (
            <button style={{ background: "#329BFA", padding: "10px 16px", display: "flex", gap: "8px", borderRadius: "8px", boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
                onClick={onClick}
            >
                {
                    preIcon && <>{preIcon}</>
                }
                <span style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>{title}</span>
            </button>
        )
    }

    const BlogCard = ({ title, image, description, isEditing, onClick, onDelte, deleteProcessing }: { title?: String, image?: any, description?: String, isEditing: boolean, onClick?: any, onDelte?: any, deleteProcessing?: boolean }) => {
        return (
            <div className='flex flex-col blog-card' style={{ width: "100%", maxWidth: isComponentInIFrame ? "356px" : "384px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", position: "relative", cursor: "pointer" }}

            >
                {
                    isEditing &&
                    <div className='w-[40px] h-[40px] flex justify-center items-center absolute'
                        style={{ borderRadius: "8px", right: "16px", top: "16px", cursor: "pointer", zIndex: 2 }}
                        onClick={onDelte}
                    >
                        {
                            deleteProcessing
                                ?
                                <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                                :
                                <div className='w-[40px] h-[40px] flex justify-center items-center'
                                    style={{ background: "white", borderRadius: "8px", right: "16px", top: "16px", cursor: "pointer", zIndex: 2 }}
                                    onClick={onDelte}
                                >
                                    <TrashIcon />
                                </div>
                        }
                    </div>
                }
                <img style={{ width: "100%", height: "240px", minHeight: "240px", borderRadius: "16px", background: "#DFDFDF", objectFit: "cover" }}
                    src={image || "https://s3-alpha-sig.figma.com/img/92f9/d44d/896aad9fd5981c841633a846ddb6994b?Expires=1694390400&Signature=Y0LF-spWJBRJPwR6PuO3FZPQBifbZlSd3DwU1~93PC7F1rM5ajjXSUf7DvyAZFwNakWwxk~DEITJMJOMkeidCERWErJsbyFiQ~DKQ6U3EQX~rMgitH~Nuztsw6YjHNyh2F7dEEXwlms6Ef1OA04ccE~HOKV4igY3N1J66uF5cTayJ4YL6HYKInO7YFvAkECUKsUw4ZZhVw6bPUkJA2JZCQh53vjGTQowNo7BrUCBuRWtXsEzgC-dvb7oIC6aUSXuf9Ra2hE-LcKUQmG3JqnwAqQigarPQiqffk-vF2MzkKgx-QoFupQGqk6IayqV41uO1wHbsZEcLNoEUkPykLdEfw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"}
                    alt='blog'
                    onClick={deleteProcessing ? () => { } : onClick}
                />
                <span className='blog-title' title={`${title}`} style={{ fontSize: "24px", fontWeight: "600", color: "#101828", marginTop: "16px" }}
                    onClick={deleteProcessing ? () => { } : onClick}
                >{title || "{Blog Title}"}</span>
                <span className='blog-description' style={{
                    fontSize: "16px", fontWeight: "400", color: "#101828"
                }}
                    dangerouslySetInnerHTML={{ __html: String(description || '') }}
                    onClick={deleteProcessing ? () => { } : onClick}
                />
            </div>
        )
    }


    if (error) return <p>Error: {error?.message}</p>;
    if (loading) return <Loading />;



    return (
        <>
            <CustomModal isOpen={isOpenModal} title={"Do you want to delete the blog?"} onClose={() => { setisOpenModal(false) }} onSubmit={() => { deleteBlogFunc(selectedBlogId) }} type={"custom"} />
            <div className='flex' style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", padding: isComponentInIFrame ? "32px" : "0px 32px" }}>
                <div className='flex' style={{ flexDirection: "column", width: "100%", maxWidth: "1216px" }}>
                    {
                        isComponentInIFrame &&
                        <div className='flex justify-end' style={{ height: "41px", alignItems: "center" }}>
                            {
                                processing
                                    ?
                                    <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                                    :
                                    <Button title={"Add New Blog"} preIcon={<PlusIcon />} onClick={() => {
                                        createBlogFuc()
                                    }} />
                            }

                        </div>
                    }
                    <div className='flex gap-[24px] flex-wrap justify-start' style={{ marginTop: "24px", columnGap: "32px" }}>
                        {
                            getBlogsData?.allBlogs?.blogs.map((blog, index) => {
                                if (blog.title || blog.description || blog.image) {
                                    const slug = String(blog.title).toLowerCase().replaceAll(' ', '-');
                                    return (
                                        <BlogCard isEditing={isComponentInIFrame} key={index} title={blog.title} image={blog.image} description={blog.description}
                                            onClick={() => {
                                                if (!isComponentInIFrame) {
                                                    navigate(`/blog/${blog.id}/${slug}`);
                                                }
                                                else {
                                                    navigate(`/blog/edit/${blog.id}`);
                                                }
                                            }}
                                            onDelte={() => { setselectedBlogId(blog.id); setisOpenModal(true) }}
                                            deleteProcessing={delteBlogProcessing.filter((item, _) => { return (item === `${blog.id}`) }).length > 0}
                                        />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;
