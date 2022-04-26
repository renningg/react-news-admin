import axios from 'axios'
import { useState, useEffect } from 'react'
import { notification } from 'antd'
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(res => {
        setdataSource(res.data)
      })
  }, [username, type])

  const handlePublish = (id) => {
    // 前端
    setdataSource(dataSource.filter(item => item.id !== id))
    // 后端补丁
    axios.patch(`/news/${id}`, {
      "publishState": 1,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `已发布！您可以到【发布管理/已发布】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }
  const handleDelete = (id) => {
    // 前端
    setdataSource(dataSource.filter(item => item.id !== id))
    // 后端补丁
    axios.patch(`/news/${id}`, {
      "publishState": 2,
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `已删除该新闻`,
        placement: "bottomRight"
      });
    })
  }
  const handleSunset = (id) => {
    // 前端
    setdataSource(dataSource.filter(item => item.id !== id))
    // 后端补丁
    axios.patch(`/news/${id}`, {
      "publishState": 3,
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `已下线！您可以到【发布管理/已下线】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }


  return {
    dataSource,
    handleDelete,
    handleSunset,
    handlePublish
  }

}
export default usePublish