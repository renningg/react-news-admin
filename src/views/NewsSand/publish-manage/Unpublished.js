import React from 'react'
import { Button } from 'antd'
import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
export default function Unpublished() {
    // 1===待发布的
    const { handlePublish, dataSource } = usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handlePublish(id)}>发布</Button>
            }></NewsPublish>
        </div>
    )
}
