import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "posts")

export function getAllPostFileNames() {
    return fs.readdirSync(postsDirectory).map((fileName) => {
        return fileName.replace(/\.md$/, '');
    });
}

export function getAllPostIds() {
    const fileNames = getAllPostFileNames()
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}

export function getSortedPostsData() {
    // Get file names under dir posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((filename) => {
        // Extract id from the file name
        const id = filename.replace(/\.md$/, '');

        // Read the markdown file
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, "utf8")

        // Use Grey to parse the markdown file content
        const matterResults = matter(fileContents)

        // Combine the data with its id
        return {
            id,
            ...matterResults.data
        }
    })

    // Sort extracted posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    })
}