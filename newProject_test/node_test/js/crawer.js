var http=require('http');
var Promise=require('bluebird');
var cheerio=require('cheerio');
//var _url='http://www.baidu.com/';
var _url='http://www.imooc.com/learn/348';
var baseUrl='http://www.imooc.com/learn/';
var videoIds=[348,259,75];

function filterChapters(_html){
	var $=cheerio.load(_html);
	var chapters=$('.chapter');
	var title=$('#page_hader .path span').text();
	var numbers=parseInt($($('.info_num i')[0]).text().trim(),10);
//	courseData={
//		title:title,
//		numbers:numbers,
//		videos:[{
//			chapterTitle:'',
//			videos:[
//				title:'',
//				id:''
//			]
//		}]
//	}
	var courseData={
		videos:[],
		numbers:numbers,
		title:title,
	};
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
		courseData.videos.push(chapterData);
	});
	return courseData;
}
function printCourseInfo(courseDatas){
	courseDatas.forEach(function(courseData){
		console.log(courseData.number+'人学过'+courseData.title+'\n');
	})
	courseDatas.forEach(function(courseData){
		console.log('####'+courseData.title+'\n');
		courseData.forEach(function(item){
			var chapterTitle=item.chapterTitle;
			console.log(chapterTitle+'\n');
			item.videos.forEach(function(video){
				console.log('id:['+video.id+']'+video.title+'/n');
			});
		});
	});
}

function getPageAsync(url){
	return new Promise(function(resolve,reject){
		console.log('正在爬取'+url);
		http.get(_url,function(res){
			var _html='';
			res.on('data',function(data){
				_html+=data;
			});
			res.on('end',function(){
				resolve(_html);
//				var courseData=filterChapters(_html);
//				printCourseInfo(courseData);
			});
		}).on('error',function(e){
			reject(e)
			console.log('获取百度数据错误');
		});
	})
}

var fetchCourseArray=[];

videoIds.forEach(function(id){
	fetchCourseArray.push(getPageAsync(baseUrl+id));
});

Promise.all(fetchCourseArray).then(function(pages){
	var courseDatas=[];
	pages.forEach(function(html){
		var courese=filterChapters(html);
		courseDatas.push(courese);
	});
	courseDatas.sort(function(x,y){
		return x.numbers<y.numbers
	});
	printCourseInfo();
});

