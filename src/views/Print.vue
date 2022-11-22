<template>
  <div class="user-info-container">
    <el-card class="print-box">
      <el-button type="primary" :loading="printLoading" v-print="printObj">
        列印
      </el-button>
    </el-card>

    <el-card>
      <div class="user-info-box" id="userInfoBox">
        <!-- 標題 -->
        <h2 class="title">系統機能增修單</h2>
        <!-- 頭部 -->
        <div class="header">
          <!-- 頭部表格 -->
          <el-descriptions :column="2" border>
            <el-descriptions-item label="申請單位" width="450px">{{
              detailData.deptName
            }}</el-descriptions-item>
            <el-descriptions-item label="申請人" width="450px">{{
              detailData.userName
            }}</el-descriptions-item>
            <el-descriptions-item label="需要完成時間" width="450px">{{
              formateDate(new Date(detailData.deadline)).split(" ")[0]
            }}</el-descriptions-item>
            <el-descriptions-item label="工時" width="450px">
              <div>
                <span>{{ detailData.workhours }}/h</span>
                <span>({{ detailData.workhours * 2000 }}元)</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 內容 -->
        <div class="body">
          <el-descriptions direction="vertical" :column="1" border>
            <el-descriptions-item label="評估說明">
              {{ detailData.evaluateInstruction }}
            </el-descriptions-item>
            <el-descriptions-item label="資訊評估結果">
              {{ detailData.evaluateResult }}
            </el-descriptions-item>
            <el-descriptions-item label="簽核紀錄">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in detailData.auditLogs"
                  :key="index"
                  :timestamp="formateDate(new Date(item.createTime))"
                >
                  {{ item.action }}&nbsp;&nbsp;{{ item.userName }}
                </el-timeline-item>
              </el-timeline>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 尾部 -->
        <!-- <div class="foot">{{ $t('msg.userInfo.foot') }}</div> -->
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue-demi";
import { useRoute } from "vue-router";
import { systemFindOneApi } from "../api";
import { formateDate } from "../utils/utils";
const route = useRoute();

const detailData = ref({});
const getUserDetail = async () => {
  const { systemInfo } = await systemFindOneApi({ id: route.params.id });
  systemInfo.userName = systemInfo.applyUser.userName;
  detailData.value = systemInfo;
};
getUserDetail();

// 列印相關
const printLoading = ref(false);
const printObj = {
  //列印區域
  id: "userInfoBox",
  // 列印標題
  popTitle: "葡眾企業",
  // 列印前
  beforeOpenBallback(vue) {
    printLoading.value = true;
  },
  // 執行列印
  openCallback(vue) {
    printLoading.value = false;
  },
};
</script>

<style scoped lang='scss'>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 950px;
  margin: 0 auto;
  .title {
    text-align: center;
    margin-bottom: 18px;
  }
  .header {
    display: flex;
    :v-deep .el-descriptions {
      flex-grow: 1;
    }
    .remark {
      margin-right: 12px;
    }
  }
  .body {
    ul {
      list-style: none;
      li {
        span {
          margin-right: 62px;
        }
      }
    }
  }
  .foot {
    margin-top: 42px;
    text-align: right;
  }
}
</style>