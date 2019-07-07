// 查询公司列表
export const companyList = '/wechat/wxcompany/list'

// 查询职位列表
export const positionList = '/wechat/wxposition/list'

// 个人上传简历信息查询
export const queryResumeInfo = '/wechat/wxapplyResume/getByUnionid'

// 确认申请意向
export const confirmApply = '/wechat/wxapplyResume/applyResume'

// 小程序扫码回调
export const afterScancode = '/wxuser/pcQuickMarkLogin'

// 奖学金类型列表
export const scholarTypeList = '/wechat/scholarship/getAll'

// 保存奖学金申请信息
export const saveApplyInfo = '/wechat/applyScholarship/save'

// 奖学金详情查询
export const scholarDetail = '/wechat/applyScholarship/getUserApplyScholarship'

// 上传图片地址
export const uploadUrl = '/wechat/img/uploadForDayPath'

// 选择入职公司
export const intentionCompany = '/wechat/wxintentionCompany/list'

// 获取更新状态
export const getUpdateStatus = '/wechat/applyScholarship/getChangeStatus'

// 更新状态
export const updateStatus = '/wechat/applyScholarship/updateChangeStatus'

// 奖学金申请失败重新申请
export const reApply = '/wechat/applyScholarship/reapplyApplyScholarship'

// 审核失败重新申请
export const failReapply = '/wechat/wxapplyResume/reapply'