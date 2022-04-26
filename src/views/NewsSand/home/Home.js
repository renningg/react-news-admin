import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as Echarts from 'echarts'
import _ from 'lodash'
export default function Home() {
  const { Meta } = Card;
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setstarList(res.data)
    })
  }, [])

  useEffect(() => {

    axios.get("/news?publishState=2&_expand=category").then(res => {
      // console.log(res.data)
      // console.log()
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj)
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    // 随着页面，Echarts随着页面缩放
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderPieView = () => {
    // 数据处理
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    var myChart;
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart)
    }
    else {
      myChart = pieChart
    }

    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    option && myChart.setOption(option);
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title=" 用户最常浏览" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={item => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ width: 400 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setVisible(true)
                setTimeout(() => {
                  renderPieView()
                }, 0);
              }



              }

              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={roleName}
            />
          </Card>
        </Col>
      </Row>
      <Drawer width="500px" title="Basic Drawer" placement="right" onClose={() => {
        setVisible(false);
      }} visible={visible}>
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>
      <div ref={barRef} style={{
        width: '100%',
        height: '400px',
        marginTop: '30px'
      }}></div>

    </div>
  )
}
