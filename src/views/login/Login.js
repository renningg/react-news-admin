import { Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import { useNavigate } from "react-router-dom";
import logoPicture from "../../assets/logo.png";
import { useState } from 'react';
import axios from 'axios'

export default function Login() {
  // 设置Loading加载状态
  const [loading, setLoading] = useState(false)
  // 调用路由
  let navigate = useNavigate();
  // 提交表单用户数据
  const handleLogin = (username, password) => {
    setLoading(true)
    let values = { username, password }
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      // console.log(res.data)
      if (res.data.length === 0) {
        setTimeout(() => {
          message.error("用户名或密码不匹配")
          setLoading(false)
        }, 500);

      } else {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        // 登陆成功
        setTimeout(() => {
          message.success('登陆成功！');
          setLoading(false)
          // 路由跳转
          navigate("/home");
        }, 500)
      }
    })

  }
  const onFinish = values => handleLogin(values.username, values.password)

  return (
    <div className='fatherContainer'>
      <div className='login-form-container'>
        <div className='loadingContainer'>
          <Spin size="large" spinning={loading}></Spin>
        </div>
        <div className='imgContainer'>
          <img src={logoPicture} alt="" />
        </div>

        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            initialValue="admin"
            rules={[
              {
                required: true,
                message: '请输入账户!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            initialValue="123456"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  )
}
