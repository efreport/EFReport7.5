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


<iframe style="width: 100%; height: 90%;" src="http://127.0.0.1:8099/EFRS/report.html?id=5497"></iframe>

<!--
带有参数调用方法

<iframe style="width: 100%; height: 90%;" src="http://127.0.0.1:8099/EFRS/report.html?id=2135&params=<%=URLEncoder.encode("param1=2016-1-10;param2=2018-05-01","UTF-8")%>
"></iframe>

-->

</body>
<script>
   

</script>
</html>