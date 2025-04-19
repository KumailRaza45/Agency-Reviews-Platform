import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { ReactComponent as PlusIcon } from "../../assets/Icons/plus.svg"
import { ReactComponent as TrashIcon } from "../../assets/Icons/Trash.svg"
import { ReactComponent as LeftArrow } from "../../assets/Icons/left-arrow.svg"
import { ReactComponent as MinusArrow } from "../../assets/Icons/minus-circle.svg"
import { ReactComponent as DnDArrow } from "../../assets/Icons/DnD.svg"


import fileUpload from "../../assets/Icons/upload_to_cloud.svg";


import BlogImage from "../../assets/images/blog.jpg";
import Section1Image from "../../assets/images/section_1.jpg";
import Section2Image from "../../assets/images/section_2.jpg";

import "./style.css"
import { title } from 'process';
import SpinnerContext from '../../Context/SpinnerContext';
import { handleFileUploadCommon } from '../../common/common';
import BlogSection from './BlogSection';
import { log } from 'console';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Loading';

type sectionObj = {
    title: string;
    description: string;
    image: string;
}

let draggedItem: sectionObj | null = null

const GET_BLOG = gql`
    query GetBlog($id: Float!) {
    getBlog(id: $id) {
        id
        title
        description
        image
        # Add other fields you want to retrieve here
        sections {
        id
        title
        content
        deleted
        blogId
        image
        # Add other fields from the 'sections' model if needed
        }
    }
    }
`
const BlogContentView = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const { data: getBlogsData, loading, error } = useQuery(GET_BLOG, {
        variables: { id: parseInt(`${id}`) },
    });

    if (error) return <p>Error: {error?.message}</p>;
    if (loading) return <Loading />;

    return (
        <div className='flex blog-view' style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", padding: "32px" }}>
            <div className='flex' style={{ flexDirection: "column", width: "100%", maxWidth: "1216px" }}>
                <div className='flex w-100 gap-[16px]' style={{ alignItems: "center" }}>
                    <LeftArrow style={{ cursor: "pointer" }} onClick={() => { window.history.back() }} />
                    <span style={{ fontSize: "24px", fontWeight: "600", lineHeight: "30px" }} className='font-montserrat'>{getBlogsData?.getBlog?.title || `"{Blog title}"`}</span>
                </div>
                {
                    getBlogsData?.getBlog?.image && <img style={{ borderRadius: "16px", height: "400px", marginTop: "34px", objectFit: "contain" }} src={getBlogsData?.getBlog?.image} alt='Not Found' />
                }

                {
                    getBlogsData?.getBlog?.description &&
                    <span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "20px", textAlign: "left", marginTop: "24px" }} className='font-montserrat'
                        dangerouslySetInnerHTML={{ __html: String(getBlogsData?.getBlog?.description || "") }}
                    />
                    // <span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "20px", textAlign: "left", marginTop: "24px" }} className='font-montserrat'>
                    //     {getBlogsData?.getBlog?.description}
                    // </span>
                }


                {
                    getBlogsData?.getBlog?.sections?.map((section, _index) => {
                        return (
                            <Fragment>

                                {section?.title && <span style={{ fontSize: "24px", fontWeight: "600", lineHeight: "30px", marginTop: "32px" }} className='font-montserrat'>{section?.title}</span>}
                                {section?.image && <img style={{ borderRadius: "16px", height: "400px", marginTop: "24px", objectFit: "cover" }} src={section?.image} alt='Not Found' />}
                                {
                                    section?.content &&
                                    <span
                                        style={{ fontSize: "14px", fontWeight: "500", lineHeight: "20px", textAlign: "left", marginTop: "24px" }}
                                        className='font-montserrat'
                                        dangerouslySetInnerHTML={{ __html: String(section?.content || "") }}
                                    />
                                    // <span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "20px", textAlign: "left", marginTop: "24px" }} className='font-montserrat'>
                                    //     {section?.content}
                                    // </span>
                                }
                            </Fragment>
                        )
                    })
                }
            </div>

        </div>
    );
};

export default BlogContentView;
