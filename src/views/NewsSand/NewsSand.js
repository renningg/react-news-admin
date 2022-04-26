import React from 'react'
import { useRoutes } from 'react-router'
import SideMenu from '../../components/layout/SideMenu'
import TopHeader from '../../components/layout/TopHeader'
import Home from './home/Home'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'
import NotFound from '../404/404'
import { Layout, Spin } from 'antd';
import './NewsSand.css'
import NewsAdd from './news-manage/NewsAdd'
import NewsDraft from './news-manage/NewsDraft'
import NewsCategory from './news-manage/NewsCategory'
import NewsPreview from './news-manage/NewsPreview'
import NewsUpdate from './news-manage/NewsUpdate'
import AuditList from './audit-manage/AuditList'
import Unpublished from './publish-manage/Unpublished'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import Audit from './audit-manage/Audit'
import { connect } from 'react-redux'
const { Content } = Layout;
function NewsSand(props) {
  const element = useRoutes([
    {
      path: '/home',
      element: <Home></Home>
    },
    {
      path: '/user-manage/list',
      element: <UserList></UserList>
    },
    {
      path: '/right-manage/role/list',
      element: <RoleList></RoleList>
    },
    {
      path: '/right-manage/right/list',
      element: <RightList></RightList>
    },
    {
      path: '/news-manage/add',
      element: <NewsAdd></NewsAdd>
    },
    {
      path: '/news-manage/draft',
      element: <NewsDraft></NewsDraft>
    },
    {
      path: '/news-manage/category',
      element: <NewsCategory></NewsCategory>
    },
    {
      path: '/audit-manage/list',
      element: <AuditList></AuditList>
    },
    {
      path: '/audit-manage/audit',
      element: <Audit></Audit>
    },
    {
      path: '/publish-manage/unpublished',
      element: <Unpublished></Unpublished>
    },
    {
      path: '/publish-manage/published',
      element: <Published></Published>
    },
    {
      path: '/publish-manage/sunset',
      element: <Sunset></Sunset>
    },
    {
      path: '/news-manage/preview/:id',
      element: <NewsPreview></NewsPreview>
    },
    {
      path: '/news-manage/update/:id',
      element: <NewsUpdate></NewsUpdate>
    },
    {
      path: '*',
      element: <NotFound></NotFound>
    },
  ])
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            Height: 280,
            overflow: "auto"
          }}
        >
          <Spin size='large' spinning={props.isLoading}>
            {element}
            {/* <Routes>
              <Route path='/home' element={<Home></Home>} />
              <Route path='/user-manage/list' element={<UserList></UserList>} />
              <Route path='/right-manage/role/list' element={<RoleList></RoleList>} />
              <Route path='/right-manage/right/list' element={<RightList></RightList>} />
              <Route path='/news-manage/add' element={<NewsAdd></NewsAdd>} />
              <Route path='/news-manage/draft' element={<NewsDraft></NewsDraft>} />
              <Route path='/news-manage/category' element={<NewsCategory></NewsCategory>} />
              <Route path='/audit-manage/list' element={<AuditList></AuditList>} />
              <Route path='/audit-manage/audit' element={<Audit></Audit>} />
              <Route path='/publish-manage/unpublished' element={<Unpublished></Unpublished>} />
              <Route path='/publish-manage/published' element={<Published></Published>} />
              <Route path='/publish-manage/sunset' element={<Sunset></Sunset>} />
              <Route path='/news-manage/preview/:id' element={<NewsPreview></NewsPreview>} />
              <Route path='/news-manage/update/:id' element={<NewsUpdate></NewsUpdate>} />
              <Route path='*' element={<NotFound></NotFound>} />
            </Routes> */}
          </Spin>

        </Content>

      </Layout>
    </Layout>
  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsSand)