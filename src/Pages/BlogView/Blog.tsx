import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { useParams } from 'react-router-dom';
import Loading from '../../Loading';
import BlogContentView from './BlogContentView';
import BlogEditView from './BlogEditView';

type sectionObj = {
    title: string;
    description: string;
    image: string;
}

let draggedItem: sectionObj | null = null

const Blog: React.FC = () => {

    const { id } = useParams()
    const [isComponentInIFrame, setIsComponentInIFrame] = useState(false)

    useEffect(() => {
        if (window.self !== window.top) {
            // Component is inside an iframe
            setIsComponentInIFrame(true)
        } else {
            // Component is not in an iframe
            setIsComponentInIFrame(false)
        }
    }, [])

    // useEffect(() => {
    //     console.log(getBlogsData?.getBlog, "getBlogsData");

    // }, [getBlogsData])

    // if (error) return <p>Error: {error?.message}</p>;
    // if (loading) return <Loading />;

    return (
        <>
            {/* {
                !isComponentInIFrame
                    ?
                    <BlogEditView _blog={getBlogsData?.getBlog} />
                    :
                    <BlogContentView />
            } */}
        </>
    );
};

export default Blog;
