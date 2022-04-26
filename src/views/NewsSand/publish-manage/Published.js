import React from 'react'
import { Button } from 'antd'
import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
export default function Published() {
    // 2===已发布的
    const { dataSource, handleSunset } = usePublish(2)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={()=>handleSunset(id)}>下线</Button>
            }></NewsPublish>
        </div>
    )
}
