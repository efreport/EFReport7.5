<%@page import="java.net.URLEncoder"%>
<%@page import="org.apache.http.Header"%>
<%@page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@page import="org.apache.http.util.EntityUtils"%>
<%@page import="org.apache.http.HttpEntity"%>
<%@page import="org.apache.http.client.methods.CloseableHttpResponse"%>
<%@page import="org.apache.http.client.entity.UrlEncodedFormEntity"%>
<%@page import="com.efreport.util.RsaUtils"%>
<%@page import="java.util.ArrayList"%>
<%@page import="org.apache.http.message.BasicNameValuePair"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.http.impl.client.HttpClients"%>
<%@page import="org.apache.http.impl.client.CloseableHttpClient"%>
<%@page import="org.apache.http.HttpResponse"%>
<%@page import="org.apache.http.entity.StringEntity"%>
<%@page import="org.apache.http.entity.ContentType"%>
<%@page import="org.apache.http.client.methods.HttpPost"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<html lang="zh-cmn-Hans">
<html>
<head>
<meta charset="UTF-8" />
</head>
<!--
使用http请求获取公钥
http://IP:端口/EFRS/thirdSys/getPublic
再将获取的公钥替换下面公钥的位置 
data + "@" + companyId + "@" + userId;
-->
<%!
  public String getToken() throws Exception {

      String data = String.valueOf(System.currentTimeMillis());
      String encryptData = RsaUtils.encrypt(data, RsaUtils.getPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ/FX+P2tVdxtdNEGi4QApPyrPeNFxMH3S/o3XNmyeir9qu3sJZbxxvOOoLC6whbVWNx75HbnIjEzQsSnY9onAMtsCYhMeRb0BnFxwFlIe4NnqXrGVFq34+mAla7+rGZM7gI5WNYLmUYi9j/+SJsK++proG2GIfB579RqCfImYfwIDAQAB"));
	  
      return encryptData;
  }
%>

<!--设计器token-->
<%!
  public String getTokenDesign() throws Exception {

      String data = String.valueOf(System.currentTimeMillis());
	  data = data + "@" + "1" + "@" + "2";  
      String encryptData = RsaUtils.encrypt(data, RsaUtils.getPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ/FX+P2tVdxtdNEGi4QApPyrPeNFxMH3S/o3XNmyeir9qu3sJZbxxvOOoLC6whbVWNx75HbnIjEzQsSnY9onAMtsCYhMeRb0BnFxwFlIe4NnqXrGVFq34+mAla7+rGZM7gI5WNYLmUYi9j/+SJsK++proG2GIfB579RqCfImYfwIDAQAB"));
	  
      return encryptData;
  }
%>

<!--普通token-->
<%!
  public String getTokenNormal() throws Exception {

      String data = String.valueOf(System.currentTimeMillis());
	  data = data + "@" + "1" + "@" + "6";  
      String encryptData = RsaUtils.encrypt(data, RsaUtils.getPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ/FX+P2tVdxtdNEGi4QApPyrPeNFxMH3S/o3XNmyeir9qu3sJZbxxvOOoLC6whbVWNx75HbnIjEzQsSnY9onAMtsCYhMeRb0BnFxwFlIe4NnqXrGVFq34+mAla7+rGZM7gI5WNYLmUYi9j/+SJsK++proG2GIfB579RqCfImYfwIDAQAB"));
	  
      return encryptData;
  }
%>

<body>
 <button onclick="getComp()">获取公司</button>
 <button onclick="getUsers()">获取用户</button>
  <button onclick="reportList()">模板列表</button>
 <button onclick="deleteReport()">删除模板</button>
  <button onclick="newReport()">新建模板</button>
 <button onclick="cloneReport()">克隆模板</button>
 <button onclick="renameReport()">模板重命名</button>
 <button onclick="openDesign()">设计账号</button>
 <button onclick="openDesignByID()">设计指定模板</button>
 <button onclick="viewReport()">预览不传参模板</button>
 <button onclick="viewReport1()">预览传参模板</button>
 <button onclick="getDataByTemplet()">获取模板数据</button>
 <button onclick="expMulExcel()">导出多个参数混合excel</button>
 <button onclick="expExcel()">导出单个有参数excel</button>
  <button onclick="expExcelW()">导出单个无参数excel</button>
  <button onclick="expSigExcel()">导出单个excel</button>
 <button onclick="expSigExcelParam()">导出单个有参数excel</button>
 <button onclick="expPub()">导出公开报表excel</button>
 <button onclick="expPubParam()">导出公开报表带参数excel</button>
 
  <button onclick="expMulPdf()">导出多个参数混合Pdf</button>
 <button onclick="expPdf()">导出单个有参数Pdf</button>
  <button onclick="expPdfW()">导出单个无参数Pdf</button>
  <button onclick="expSigPdf()">导出单个Pdf</button>
 <button onclick="expSigPdfParam()">导出单个有参数Pdf</button>
 <button onclick="expPubPdf()">导出公开报表Pdf</button>
 <button onclick="expPubPdfParam()">导出公开报表带参数Pdf</button>
 
   <button onclick="expMulWord()">导出多个参数混合word</button>
 <button onclick="expWord()">导出单个有参数word</button>
  <button onclick="expWordW()">导出单个无参数word</button>
  <button onclick="expSigWord()">导出单个word</button>
 <button onclick="expSigWordParam()">导出单个有参数word</button>
 <button onclick="expPubWord()">导出公开报表word</button>
 <button onclick="expPubWordParam()">导出公开报表带参数word</button>
 
   <button onclick="ptSig()">打印单个</button>
 <button onclick="ptSigParam()">打印单个有参数</button>
 <button onclick="ptPub()">打印公开报表</button>
 <button onclick="ptPubParam()">打印公开报表带参数</button>
</body>
<script>

	function getComp(){
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/getCompanies?token=<%=getToken()%>';

	  window.open(url); 
		
	}

	function getUsers(){
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/getUsers?companyId=1&token=<%=getToken()%>';

	  window.open(url); 
		
	}
	
		function reportList(){
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/getTemplates?userId=2&token=<%=getToken()%>';

	  window.open(url);
	}
	
	function deleteReport(){	
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/delTemplate?templateId=5629&token=<%=getToken()%>';
	  window.open(url);
	}
	
   function openDesign(){
	   
	  var url = 'http://127.0.0.1:8099/design/design.html?token=<%=getTokenDesign()%>';

	  window.open(url); 
   }
   
   function openDesignByID(){
	   	  var url = 'http://127.0.0.1:8099/design/design.html?token=<%=getTokenDesign()%>&templateId=2073';

	  window.open(url); 
   }
   
   function viewReport(){

	  var url = 'http://127.0.0.1:8099/EFRS/report.html?id=2133&token=<%=getTokenNormal()%>';

	  
	  window.open(url);
   }
   
	function viewReport1(){


	var url = 'http://127.0.0.1:8099/EFRS/report.html?id=3203&params=<%=URLEncoder.encode("param1=王五","UTF-8")%>&token=<%=getTokenNormal()%>';

	window.open(url);
	}
   
    function cloneReport(){
	  var url = 'http://127.0.0.1:8099/EFRS/thirdSys/cloneTemplate?token=<%=getToken()%>&templateId=5634';
	  window.open(url);
   }

	
	function renameReport(){	
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/renameTemplate?token=<%=getToken()%>&templateId=5634&name=<%=URLEncoder.encode("第三方测试新建改","UTF-8")%>';
	  window.open(url);
	}
	
	function newReport(){	
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/newTemplate?token=<%=getToken()%>&userId=2&templateName=<%=URLEncoder.encode("第三方测试新建","UTF-8")%>';
	  window.open(url);
	}
	
	function getDataByTemplet(){
		var url = 'http://127.0.0.1:8099/EFRS/thirdSys/getDataByTemplet?token=<%=getTokenDesign()%>&templateId=2071&cellInfo=<%=URLEncoder.encode("[{\"SheetName\":\"sheet1\",\"Cells\":[{\"X\":3,\"Y\":4},{\"X\":1,\"Y\":1},{\"X\":2,\"Y\":4}]}]","UTF-8")%>';

	  window.open(url); 
		
	}
	
	function expMulExcel(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcels?token=<%=getTokenDesign()%>&templateIds=2073,2080&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
		function expExcel(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcels?token=<%=getTokenDesign()%>&templateIds=2073&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
			function expExcelW(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcels?token=<%=getTokenDesign()%>&templateIds=2080';
	  window.open(url);
	}
	
				function expSigExcel(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcel?token=<%=getTokenDesign()%>&templateId=2080&fileName=<%=URLEncoder.encode("导出EXCEL1","UTF-8")%>';
	  window.open(url);
	}
	
					function expSigExcelParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcel?token=<%=getTokenDesign()%>&templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出EXCEL2","UTF-8")%>';
	  window.open(url);
	}

					function expPub(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcel?templateId=2989&fileName=<%=URLEncoder.encode("导出EXCEL3","UTF-8")%>';
	  window.open(url);
	}
	
						function expPubParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expExcel?templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出EXCEL4","UTF-8")%>';
	  window.open(url);
	}
	
			function expMulPdf(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdfs?token=<%=getTokenDesign()%>&templateIds=2073,2080&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
		function expPdf(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdfs?token=<%=getTokenDesign()%>&templateIds=2073&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
			function expPdfW(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdfs?token=<%=getTokenDesign()%>&templateIds=2080';
	  window.open(url);
	}
	
				function expSigPdf(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdf?token=<%=getTokenDesign()%>&templateId=2080&fileName=<%=URLEncoder.encode("导出PDF1","UTF-8")%>';
	  window.open(url);
	}
	
					function expSigPdfParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdf?token=<%=getTokenDesign()%>&templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出PDF2","UTF-8")%>';
	  window.open(url);
	}

					function expPubPdf(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdf?templateId=2989&fileName=<%=URLEncoder.encode("导出PDF3","UTF-8")%>';
	  window.open(url);
	}
	
						function expPubPdfParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expPdf?templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出PDF4","UTF-8")%>';
	  window.open(url);
	}
	
				function expMulWord(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWords?token=<%=getTokenDesign()%>&templateIds=2073,2080&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
		function expWord(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWords?token=<%=getTokenDesign()%>&templateIds=2073&params=<%=URLEncoder.encode("{\"2073\":\"param1=雪碧,361\"}","UTF-8")%>';
	  window.open(url);
	}
	
			function expWordW(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWords?token=<%=getTokenDesign()%>&templateIds=2080';
	  window.open(url);
	}
	
				function expSigWord(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWord?token=<%=getTokenDesign()%>&templateId=2080&fileName=<%=URLEncoder.encode("导出WORD1","UTF-8")%>';
	  window.open(url);
	}
	
					function expSigWordParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWord?token=<%=getTokenDesign()%>&templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出WORD2","UTF-8")%>';
	  window.open(url);
	}

					function expPubWord(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWord?templateId=2989&fileName=<%=URLEncoder.encode("导出WORD3","UTF-8")%>';
	  window.open(url);
	}
	
						function expPubWordParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/expWord?templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>&fileName=<%=URLEncoder.encode("导出WORD4","UTF-8")%>';
	  window.open(url);
	}
	
					function ptSig(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/print?token=<%=getTokenDesign()%>&templateId=2080';
	  window.open(url);
	}
	
					function ptSigParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/print?token=<%=getTokenDesign()%>&templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>';
	  window.open(url);
	}

					function ptPub(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/print?templateId=2989';
	  window.open(url);
	}
	
						function ptPubParam(){	
var url = 'http://127.0.0.1:8099/EFRS/thirdSys/print?templateId=2073&params=<%=URLEncoder.encode("param1=雪碧,361;","UTF-8")%>';
	  window.open(url);
	}
	
</script>
</html>