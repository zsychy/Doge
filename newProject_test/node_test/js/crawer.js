var http=require('http');
var cheerio=require('cheerio');
//var _url='http://www.baidu.com/';
var _url='http://www.imooc.com/learn/348';


function filterChapters(_html){
	var $=cheerio.load(_html);
	var chapters=$('.chapter');
//	[{
//		chapterTitle:'',
//		videos:[
//			title:'',
//			id:''
//		]
//	}]
	var courseData=[];
	chapters.each(function(item){
		var chapter=$(this);
		var chapterTitle=chapter.find('strong').text();
		var videos=chapter.find('.video').children('li');
		var chapterData={
			chapterTitle:chapterTitle,
			videos:[]
		}
		videos.each(function(item){
			var video=$(this).find('.studyvideo');
			var videoTitle=video.text();
			var id=video.attr('href').split('video/')[1];
			chapterData.videos.push({
				title:videoTitle,
				id:id
			});
		});
		courseData.push(chapterData);
	});
	return courseData;
}
function printCourseInfo(courseData){
	courseData.forEach(function(item){
		var chapterTitle=item.chapterTitle;
		console.log(chapterTitle+'\n');
		item.videos.forEach(function(video){
			console.log('id:['+video.id+']'+video.title+'/n');
		});
	});
}
http.get(_url,function(res){
	var _html='';
	res.on('data',function(data){
		_html+=data;
	});
	res.on('end',function(){
		var courseData=filterChapters(_html);
		printCourseInfo(courseData);
	});
}).on('error',function(){
	console.log('获取百度数据错误');
});
