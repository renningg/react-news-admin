import React, { useEffect, useState, } from 'react'
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  AuditOutlined,
  SettingOutlined,
  TeamOutlined,
  SmileOutlined
} from '@ant-design/icons';
import './index.css'
import SubMenu from 'antd/lib/menu/SubMenu';
import { useNavigate } from 'react-router';
import axios from 'axios'
import { connect } from 'react-redux'
function SideMenu(props) {
  const { Sider } = Layout;
  // 路由
  const navigate = useNavigate()
  // 设接受数据的状态
  const [menuList, setMenuList] = useState([])
  // 接收当前选中的路由地址
  const [routeDirect, setRouteDirect] = useState()
  // 从json server 获取菜单栏数据
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data);
      setMenuList(res.data)
    })
  }, [])

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  // 路由过滤
  const checkPermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }
  // 图标映射表
  const iconList = {
    '/home': <DashboardOutlined />,
    '/user-manage': <UserOutlined />,
    '/user-manage/list': <OrderedListOutlined />,
    '/right-manage': <AuditOutlined />,
    '/right-manage/role/list': <OrderedListOutlined />,
    '/right-manage/right/list': <OrderedListOutlined />,
    '/news-manage': <SettingOutlined />,
    '/news-manage/add': <OrderedListOutlined />,
    '/news-manage/draft': <OrderedListOutlined />,
    '/news-manage/category': <OrderedListOutlined />,
    '/audit-manage': <TeamOutlined />,
    '/audit-manage/audit': <OrderedListOutlined />,
    '/audit-manage/list': <OrderedListOutlined />,
    '/publish-manage': <SmileOutlined />,
    '/publish-manage/unpublished': <OrderedListOutlined />,
    '/publish-manage/published': <OrderedListOutlined />,
    '/publish-manage/sunset': <OrderedListOutlined />,
  }

  // 取数据
  const storage = localStorage.getItem('routeDirect')
  var test
  if (storage) {
    test = '/' + storage.split('/')[1]
  }

  if (routeDirect) {
    // console.log(routeDirect);
    // 存
    localStorage.setItem('routeDirect', routeDirect)
  }


  // 渲染菜单
  const renderMenuArr = (menu) => {
    return menu.map((item) => {
      if (item.children?.length > 0 && checkPermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenuArr(item.children)}
        </SubMenu>
      }
      return checkPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]}
        onClick={() => {
          navigate(item.key);
          setRouteDirect(item.key)
        }}>
        {item.title}
      </Menu.Item>
    })
  }
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: '100%', 'flexDirection': 'column' }}>
        <div className="logo" >菜菜React</div>
        <div style={{ flex: 1, 'overflow': 'auto' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[storage]}
            defaultOpenKeys={[test]}
          >
            {renderMenuArr(menuList)}
          </Menu>
        </div>
      </div>

    </Sider>
  )
}

// const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
//   isCollapsed
// })
// export default connect(mapStateToProps)(SideMenu)
export default connect(
  state=>({
    isCollapsed:state.CollApsedReducer
  }),
)(SideMenu)