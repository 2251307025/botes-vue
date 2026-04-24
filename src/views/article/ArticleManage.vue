<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'

import {ref} from 'vue'

//文章分类数据模型
const categorys = ref([])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  articleList()
}
import {useTokenStore} from "@/stores/token.js";
const tokenStore=useTokenStore();
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  articleAddService,
  articleCategoryListService,
  articleDeleteService,
  articleListService, articleUpdateService
} from '@/api/artcle.js'
//回显文章分类
const articleCategoryList = async () => {
  let result = await articleCategoryListService()
  categorys.value = result.data
}
articleCategoryList()
//获取文章列表数据
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null
  }
  let result = await articleListService(params);

  total.value = result.data.total;
  articles.value = result.data.items
  //处理分类名称
    for (let i=0;i<articles.value.length;i++){
      let article=articles.value[i];
      for (let j=0;j<categorys.value.length;j++){
        if (article.categoryId==categorys.value[j].id){
          article.categoryName = categorys.value[j].categoryName;
        }
      }
    }
}
articleList()

import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const title =ref('')
const articleModel = ref({
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})
//上传成功
const uploadSuccess=(result)=>{
  articleModel.value.coverImg=result.data;
  console.log(result.data)
}
//添加
import {ElMessage, ElMessageBox} from "element-plus";

const clearArticleModel=()=>{
  articleModel.value.content=''
  articleModel.value.state=''
  articleModel.value.coverImg=''
  articleModel.value.title=''
  articleModel.value.categoryId=''
}
const  addArticle=async (clickState) => {

  articleModel.value.state = clickState;
  let result = await articleAddService(articleModel.value)
 ElMessage.success(result.msg? result.msg:'添加成功')
  visibleDrawer.value=false
   await articleList()
}
//删除文章
const deleteArticle =(row)=>{
  ElMessageBox.confirm(
      '确定删除?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        let result = await articleDeleteService(row.id);
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        await articleList();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}
const updateArticle=async (clickState) => {
  articleModel.value.state = clickState;
  let result = await articleUpdateService(articleModel.value)
  ElMessage.success(result.msg ? result.msg : '修改成功')
  await articleList()
  visibleDrawer.value=false;
}
//文章数据回调
const showArticle=(row)=>{
  articleModel.value.title=row.title;
  articleModel.value.coverImg=row.coverImg;
  articleModel.value.categoryId=row.categoryId;
  articleModel.value.content=row.content
  articleModel.value.id=row.id;
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer=true;title='添加文章';clearArticleModel()">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline class="demo-form-inline">
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <el-button @click="categoryId='';state=''">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="visibleDrawer=true;title='编辑文章';showArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
  </el-card>
  <el-drawer v-model="visibleDrawer" :title=title  direction="rtl" size="50%">
    <!-- 添加文章表单 -->
    <el-form :model="articleModel" label-width="100px">
      <el-form-item label="文章标题">
        <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <el-select placeholder="请选择" v-model="articleModel.categoryId">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面">

        <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                   action="/api/upload"
                   name="file"
                   :headers="{'Authorization':tokenStore.token}"
                   :on-success="uploadSuccess"
        >
          <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <div class="editor">
          <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="title==='添加文章'? addArticle('已发布'):updateArticle('已发布')">发布</el-button>
        <el-button type="info" @click="title==='添加文章'? addArticle('草稿'):updateArticle('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>