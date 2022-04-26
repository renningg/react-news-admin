import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useNavigate, useParams } from 'react-router';
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
  const params = useParams()
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState()
  const [newsContent, setNewsContent] = useState()
  // const User = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {

      if (newsContent === '' || newsContent.trim() === '<p></p>') {

        message.error('新闻内容不能为空！')
      }
      else {
        // console.log(formInfo, newsContent);
        setCurrent(current + 1)
      }
    }


  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }

  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get("/categories").then(res => {
      // console.log(res.data)
      setCategoryList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      let {title,categoryId,content} = res.data
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setNewsContent(content)
    })
  }, [params.id])


  const handleSave = (auditState) => {

    axios.patch(`/news/${params.id}`, {
      ...formInfo,
      "content": newsContent,
      "auditState": auditState,
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: "bottomRight",
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/news-manage/draft')}
        title="更新新闻"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>


      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? '' : style.active}>

          <Form
            {...layout}
            name="basic"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input !' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input !' }]}
            >
              <Select>
                {
                  categoryList.map(item =>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>

        <div className={current === 1 ? '' : style.active}>
          <NewsEditor newsContent={newsContent} getContent={(value) => { setNewsContent(value) }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>

      </div>
      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
