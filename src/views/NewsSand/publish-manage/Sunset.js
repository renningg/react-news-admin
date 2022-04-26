import React from 'react'
import { Button } from 'antd'
import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
export default function Sunset() {
    // 3===已下线的
    const { dataSource, handleDelete } = usePublish(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleDelete(id)}>删除</Button>
            }></NewsPublish>
        </div>
    )
}
