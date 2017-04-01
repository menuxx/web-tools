
$(function() {

  var qrcodeTableHTML = $("#qrcodeTable").html()

  var tableList = $(".table-qrcode-list")

  function tableQrCodeUrl (tableId, accessToken) {
    return qrcodeTableHTML.replace('IMAGE_URL', "/get_table_qrcode/" + encodeURIComponent('pages/index/index?tableId=' + tableId) + `?access_token=${accessToken}`).replace("TABLE_ID", tableId)
  }

  $("#qrForm").on('submit', function (e) {
    e.preventDefault();
    var formData = Qs.parse($(this).serialize())
    if (!formData.appId) {
      alert('appId必填')
    }
    if (!formData.appSecret) {
      alert('appSecret必填')
    }
    var idFrom = Number(formData.idFrom)
    var idTo = Number(formData.idTo)
    if (!Number.isInteger(idFrom) || !Number.isInteger(idTo)) {
      alert('桌子的数量不正确')
    }

    $.ajax({
      method: 'GET',
      url: `./access_token?appId=${formData.appId}&appSecret=${formData.appSecret}`,
      dataType: 'json'
    }).then(function(data){

      var listHtml = ''

      listHtml += tableQrCodeUrl(0, data.access_token)

      for (var i=idFrom; i<=idTo; i++) {
        listHtml += tableQrCodeUrl(i, data.access_token)
      }

      tableList.html(listHtml)

    }, function(err) {
      alert('获取 access_token 失败:' + err.responseText)
    })

  })

})