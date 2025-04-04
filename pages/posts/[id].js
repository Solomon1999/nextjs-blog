import Head from "next/head"
import { Layout } from "../../components/layout"
import Date from "../../components/date"
import { getAllPostIds, getPostData } from "../../lib/posts"

import utilStyles from "../../styles/utils.module.css"

export default function Post({ postData }) {
    return (
        <Layout>
            <Head>{postData.title}</Head>

            <article>
                <h1 className={utilStyles.heaadingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}

export function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}