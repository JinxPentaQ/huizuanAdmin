<template>
  <div class="dashboard-container">
    <div class="welcome">
      <h2>欢迎您，{{ username }} !</h2>
      <span>北京时间 {{ currentDate }}</span>
    </div>
    <div class="dashboard-header">
      <div v-for="item in list" :key="item.icon" class="card_item">
        <div class="card_title">
          <div class="card_img">
            <img :src="item.icon" alt>
          </div>
          {{ item.name }}
        </div>
        <span class="card_content">{{ item.value }}</span>
      </div>
    </div>
    <div class="dashboard-content">
      <el-card
        shadow="always"
        class="box-card"
        style="height: 350px; margin-top: 25px; margin-bottom: 50px"
      >
        <div slot="header" class="clearfix">
          <span>近12小时数据走势</span>
        </div>
        <div id="myChart" :style="{ width: '100%', height: '360px' }" />
      </el-card>
      <el-card
        shadow="always"
        class="box-card"
        style="height: 350px; margin-top: 25px; margin-bottom: 50px"
      >
        <div slot="header" class="clearfix">
          <span>代收日数据量</span>
        </div>
        <div id="daishouDay" :style="{ width: '100%', height: '350px' }" />
      </el-card>
      <el-card
        shadow="always"
        class="box-card"
        style="height: 350px; margin-top: 25px; margin-bottom: 50px"
      >
        <div slot="header" class="clearfix">
          <span>代收周数据量</span>
        </div>
        <div id="daishouWeek" :style="{ width: '100%', height: '350px' }" />
      </el-card>
      <el-card
        shadow="always"
        class="box-card"
        style="height: 350px; margin-top: 25px; margin-bottom: 50px"
      >
        <div slot="header" class="clearfix">
          <span>代收月数据量</span>
        </div>
        <div
          id="daishouMonth"
          :style="{ width: '100%', height: '350px' }"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { getHomeData } from '@/api/admin'
import * as echarts from 'echarts'
import store from '@/store'
import { getCurrentTime } from '@/utils/func'
import '@/styles/walden'
export default {
  name: 'Dashboard',
  data() {
    return {
      username: '',
      currentDate: '',
      list: [
        {
          icon: require('../../assets/icon/People.png'),
          name: '接单员情况',
          value: '0',
          style: {
            'background-color': '#3F9EFF'
          }
        },
        {
          icon: require('../../assets/icon/EmptyWallet.png'),
          name: '接单员账户总余额',
          value: '0',
          style: {
            'background-color': '#F1A00C'
          }
        },
        {
          icon: require('../../assets/icon/YenCoin.png'),
          name: '佣金总余额',
          value: '0',
          style: {
            'background-color': '#F46C6C'
          }
        },
        {
          icon: require('../../assets/icon/YenCoin1.png'),
          name: '今日接单员充值usdt金额',
          value: '0',
          style: {
            'background-color': '#67C23A'
          }
        },
        {
          icon: require('../../assets/icon/Shop.png'),
          name: '商户总数',
          value: '0',
          style: {
            'background-color': '#F2F6FC',
            color: '#444'
          }
        },
        {
          icon: require('../../assets/icon/CashPayment.png'),
          name: '今日代收金额',
          value: '0',
          style: {
            'background-color': '#EBEEF5',
            color: '#444'
          }
        },
        {
          icon: require('../../assets/icon/ExtractMoney.png'),
          name: '今日代付金额',
          value: '0',
          style: {
            'background-color': '#E4E7ED',
            color: '#444'
          }
        },
        {
          icon: require('../../assets/icon/CreditCardFront.png'),
          name: '今日下发金额',
          value: '0',
          style: {
            'background-color': '#E4E7ED',
            color: '#444'
          }
        }
      ],
      hour: {
        // 每小时统计图表
        allamount: [],
        dateTime: []
      },
      days: {
        // 日统计图表
        dayswxAmount: [],
        daysaliAmount: [],
        daysyunAmount: [],
        daysbankAmount: [],
        dateTime: []
      },
      weeks: {
        // 周统计图表
        weekswxAmount: [],
        weeksaliAmount: [],
        weeksyunAmount: [],
        weeksbankAmount: [],
        dateTime: []
      },
      months: {
        // 月统计图表
        monthwxAmount: [],
        monthaliAmount: [],
        monthyunAmount: [],
        monthbankAmount: [],
        dateTime: []
      }
    }
  },
  created() {
    this.username = store.getters.name
    this.currentDate = getCurrentTime()
  },
  mounted() {
    console.log(this, 'this')
    this.getData()
  },
  methods: {
    drawLine() {
      // 初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'), 'walden')
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['代收', '代付']
        },
        grid: {
          right: '2%',
          bottom: '2%',
          left: '2%',
          top: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.hour.dateTime
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left'
          }
        ],
        series: [
          {
            name: '代收',
            type: 'line',
            data: this.hour.allamount
          }
        ]
      })
      const daishouDay = echarts.init(
        document.getElementById('daishouDay'),
        'walden'
      )
      // 绘制图表
      daishouDay.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          right: '2%',
          bottom: '2%',
          left: '2%',
          top: '10%',
          containLabel: true
        },
        legend: {
          data: ['微信', '支付宝', '云闪付', '银行卡']
        },
        xAxis: {
          type: 'category',
          data: this.days.dateTime // 日期
        },

        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          }
        },
        series: [
          {
            name: '支付宝',
            type: 'bar',
            barWidth: '10%',
            data: this.days.daysaliAmount
          },
          {
            name: '微信',
            type: 'bar',
            barWidth: '10%',
            data: this.days.dayswxAmount
          },
          {
            name: '云闪付',
            type: 'bar',
            barWidth: '10%',
            data: this.days.daysyunAmount
          },
          {
            name: '银行卡',
            type: 'bar',
            barWidth: '10%',
            data: this.days.daysbankAmount
          }
        ]
      })
      const daishouWeek = echarts.init(
        document.getElementById('daishouWeek'),
        'walden'
      )
      daishouWeek.setOption({
        legend: {
          data: ['微信', '支付宝', '云闪付', '银行卡']
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          right: '2%',
          bottom: '2%',
          left: '2%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.weeks.dateTime
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '微信',
            data: this.weeks.weekswxAmount,
            type: 'line',
            stack: 'x',
            areaStyle: {}
          },
          {
            name: '支付宝',
            data: this.weeks.weeksaliAmount,
            type: 'line',
            stack: 'x',
            areaStyle: {}
          },
          {
            name: '云闪付',
            data: this.weeks.weeksyunAmount,
            type: 'line',
            stack: 'x',
            areaStyle: {}
          },
          {
            name: '银行卡',
            data: this.weeks.weeksbankAmount,
            type: 'line',
            stack: 'x',
            areaStyle: {}
          }
        ]
      })
      const daishouMonth = echarts.init(
        document.getElementById('daishouMonth'),
        'walden'
      )
      daishouMonth.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['微信', '支付宝', '云闪付', '银行卡']
        },
        grid: {
          right: '2%',
          bottom: '2%',
          left: '2%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.months.dateTime,
          axisLine: {},
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '微信',
            type: 'line',
            data: this.months.monthwxAmount,
            smooth: true
          },
          {
            name: '支付宝',
            type: 'line',
            data: this.months.monthaliAmount,
            smooth: true
          },
          {
            name: '云闪付',
            type: 'line',
            data: this.months.monthyunAmount,
            smooth: true
          },
          {
            name: '银行卡',
            type: 'line',
            data: this.months.monthbankAmount,
            smooth: true
          }
        ]
      })
    },
    getData() {
      getHomeData().then((res) => {
        // 接单员总数
        this.list[0].value = res.userAllNumber || 0
        // 接单员账户总余额
        this.list[1].value = res.userAllAmount || 0
        // 接单员佣金总余额
        this.list[2].value = res.userGrabAmount || 0
        // 今日佣金提现金额
        this.list[3].value = res.userShareAmount || 0
        // 商户总数
        this.list[4].value = res.latformAllNumber || 0
        // 代收
        this.list[5].value = res.platformCol || 0
        // 代付
        this.list[6].value = res.platformPayment || 0
        // 下发
        this.list[7].value = res.platformOut || 0
        this.hour = res.hour
        this.days = res.days
        this.weeks = res.weeks
        this.months = res.months
        this.drawLine()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .welcome {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: #888;
      h2 {
        color: black;
      }
    }
  }

  &-header {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-column-gap: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
    padding: 20px;
    .card_item {
      border-right: 1px solid #e4e7ed;
      .card_img {
        padding-right: 40px;
        display: none;
      }
      .card_title {
        font-size: 12px;
        margin-bottom: 8px;
        color: #888;
      }
      .card_content {
        font-size: 16px;
        font-weight: 700;
        margin-top: 8px;
      }
    }
    .card_item:nth-last-child(1) {
      border-right: unset;
    }
  }
  &-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    .el-card {
      height: 460px !important;
    }
  }
}
</style>
