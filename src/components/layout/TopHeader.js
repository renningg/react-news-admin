import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Layout, Avatar, Image, Menu, Dropdown, Spin, message } from 'antd';
import picture from '../../assets/Avatar.png'
import { changeCollapsed } from '../../redux/actions/Collapsed'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
function TopHeader(props) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { Header } = Layout;
  if (JSON.parse(localStorage.getItem('token'))) {
    var { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  }

  const logout = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.removeItem('routeDirect')
      localStorage.removeItem('token')
      setLoading(false)
      navigate('/login')
      message.success("退出成功")
    }, 1000);
  }
  const changeCollapsed = () => {
    props.changeCollapsed(props.isCollapsed)
  }
  const menu = (
    <Menu>
      <Menu.Item key={1} >
        {roleName}
      </Menu.Item>
      <Menu.Item key={2} danger onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: changeCollapsed,
      })}
      <Spin className='Spin' size="large" spinning={loading} style={{ marginLeft: '40%' }}></Spin>
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>欢迎<span style={{ color: "#52C41A" }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" src={<Image src={picture} style={{ width: 32 }} />} />
        </Dropdown>
      </div>
    </Header>
  )
}
// const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
//   // console.log(state)
//   return {
//     isCollapsed
//   }
// }

// const mapDispatchToProps = {
//   changeCollapsed() {
//     return {
//       type: "change_collapsed"
//       // payload:
//     }//action 
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
export default connect(
  state => ({
    isCollapsed: state.CollApsedReducer
  }),
  { changeCollapsed }

)(TopHeader)