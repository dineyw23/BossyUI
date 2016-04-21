function Autocomplete(BKTree,utility){return{restrict:"E",replace:!0,scope:{config:"="},link:function(scope,element,attrs){scope.dict=scope.config.dict||[],scope.maxCorrections=scope.config.maxCorrections||0,scope.maxSuggestions=scope.config.maxSuggestions||5,scope.tree=new BKTree(scope.dict),scope.suggestions=[],scope.updateSuggestions=function(query){var startsWithMatches=utility.filterStartsWith(scope.dict,query,!0),correctionMatches=scope.tree.query(query,scope.maxCorrections);scope.suggestions=query.length>0?Array.from(new Set(startsWithMatches.concat(correctionMatches))):[]},scope.chooseSuggestion=function(suggestion){scope.query=suggestion,scope.updateSuggestions(suggestion)}},template:'<div>  <input ng-model="query" ng-change="updateSuggestions(query)">  <div ng-repeat="sug in suggestions" ng-click="chooseSuggestion(sug)">{{sug}}</div></div>'}}function AutocompleteUtility(){this.createMatrix=function(x,y){var i,mat=new Array(x);for(i=0;x>i;i++)mat[i]=new Array(y);return mat},this.filterStartsWith=function(words,query,caseInsensitive){var compare;return compare=caseInsensitive?function(w){return w.toLowerCase().startsWith(query.toLowerCase())}:function(w){return w.startsWith(query)},words.filter(compare)}}function AutocompleteBKTree(utility){function levDist(str1,str2){var i,j,mat=utility.createMatrix(str1.length+1,str2.length+1);for(str1=" "+str1.toLowerCase(),str2=" "+str2.toLowerCase(),i=0;i<str1.length;i++)mat[i][0]=i;for(j=0;j<str2.length;j++)mat[0][j]=j;for(j=1;j<str2.length;j++)for(i=1;i<str1.length;i++)mat[i][j]=str1[i]===str2[j]?mat[i-1][j-1]:Math.min(mat[i-1][j]+1,mat[i][j-1]+1,mat[i-1][j-1]+1);return mat[str1.length-1][str2.length-1]}function buildBKTree(dict){var i,root=dict.length>0?new BKTreeNode(dict[0]):null;for(i=1;i<dict.length;i++)root.add(new BKTreeNode(dict[i]));return root}function searchBKTree(root,query,tolerance){var dist,matchObj={},matches=[];for(dist=0;tolerance>=dist;dist++)matchObj[dist]=[];for(root.search(query,tolerance,matchObj),dist=0;tolerance>=dist;dist++)matches=matches.concat(matchObj[dist]);return matches}var BKTreeNode=function(str){this.str=str,this.children={}};return BKTreeNode.prototype={add:function(newNode){var dist;newNode.str!==this.str&&(dist=levDist(newNode.str,this.str),void 0===this.children[dist]?this.children[dist]=newNode:this.children[dist].add(newNode))},search:function(query,tolerance,matchObj){var i,dist=levDist(query,this.str);for(tolerance>=dist&&matchObj[dist].push(this.str),i=dist-tolerance>0?dist-tolerance:0;dist+tolerance>=i;i++)this.children[i]&&this.children[i].search(query,tolerance,matchObj)}},function(dict){this._root=buildBKTree(dict),this.query=function(query,tolerance){return this._root?searchBKTree(this._root,query,tolerance):[]}}}function CalendarController($scope){function getStandardTime(date){return{raw:date,year:date.getFullYear(),monthName:getMonthName(date.getMonth()),month:date.getMonth(),day:getDayName(date),date:date.getDate(),time:date.getTime()}}function getTimeObjectIfDate(date){return angular.isDate(new Date(date))?getStandardTime(new Date(date)):!1}function setConfigOptions(){$scope.config=$scope.config||{},$scope.config.start=getTimeObjectIfDate($scope.config.start),$scope.config.end=getTimeObjectIfDate($scope.config.end),options=angular.extend({},defaults,$scope.config)}function dayIsOutOfRange(_date){var hasRange=options.start&&options.end;return hasRange&&(_date.time<options.start.time||_date.time>options.end.time)?!0:options.start&&_date.time<options.start.time?!0:options.end&&_date.time>options.end.time?!0:void 0}function setSelectedDate(date){$scope.selected=getStandardTime(date),$scope.ngModel=$scope.selected.raw}function setCurrentMonthAndYear(month,year){var date=new Date(void 0!==year?year:$scope.selected.year,void 0!==month?month:$scope.selected.month,1);$scope.current=getStandardTime(date)}function getMonthName(month){return $scope.months[month]}function getDayName(date){return $scope.days[date.getDay()]}function initialize(){setConfigOptions(),setSelectedDate($scope.ngModel||new Date),setCurrentMonthAndYear(),$scope.updateDateMap()}var options={},defaults={},universal={DAY:864e5,HOUR:36e5};$scope.days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],$scope.months=["January","February","March","April","May","June","July","August","September","October","November","December"],$scope.previousMonth=function(){var date=new Date($scope.current.year,$scope.current.month-1,1);setCurrentMonthAndYear(date.getMonth(),date.getFullYear()),$scope.updateDateMap()},$scope.nextMonth=function(){var date=new Date($scope.current.year,$scope.current.month+1,1);setCurrentMonthAndYear(date.getMonth(),date.getFullYear()),$scope.updateDateMap()},$scope.selectDate=function(time){var date=getStandardTime(new Date(time));dayIsOutOfRange(date)||(date.month!==$scope.current.month&&(setCurrentMonthAndYear(date.month,date.year),$scope.updateDateMap()),setSelectedDate(new Date(time)))},$scope.updateDateMap=function(){var rawCurrentDay=$scope.current.raw.getDay()*universal.DAY,firstWeekDay=new Date($scope.current.time-rawCurrentDay),isMonthComplete=!1;for($scope.dateMap=[];!isMonthComplete;){var week=[];5===$scope.dateMap.length&&(isMonthComplete=!0);for(var weekDay=0;7>weekDay;weekDay++){var rawThisDate=firstWeekDay.getTime()+weekDay*universal.DAY,thisDate=new Date(rawThisDate);23===thisDate.getHours()?thisDate=new Date(thisDate.getTime()+universal.HOUR):1===thisDate.getHours()&&(thisDate=new Date(thisDate.getTime()-universal.HOUR));var date=getStandardTime(thisDate);date.dayInMonth=thisDate.getMonth()===$scope.current.raw.getMonth()?"day-in-month":"",date.disabledDay=dayIsOutOfRange(date)?"disabled-day":"",week.push(date)}firstWeekDay=new Date(firstWeekDay.getTime()+7*universal.DAY),$scope.dateMap.push(week)}},initialize()}function Calendar(){var template='<div class="calendarWrapper"><div class="calendarView"><table><thead><tr class="heading"><td ng-click="previousMonth()" title="Previous month" class="p"><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-chevron-right-128.png" title="Previous Month" style="transform: rotate(180deg);" width="25"><i class="ionicon ion-chevron-down"></i></td><td colspan="5" class="calendar-month">{{current.monthName}} {{current.year}}</td><td ng-click="nextMonth()" title="Next month" class="p"><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-chevron-right-128.png" title="Next Month" width="25"></td></tr></thead><tbody><tr class="week-days"><td ng-repeat="day in days" title="{{day}}">{{day | limitTo : 2}}</td></tr><tr ng-repeat="week in dateMap"><td ng-repeat="current in week" ng-click="selectDate(current.time)" class="{{current.dayInMonth}} {{current.disabledDay}} p">{{current.date}}</td></tr><tbody><tfooter><tr><td colspan="7">{{selected.day}}, {{selected.monthName}} {{selected.date}}, {{selected.year}}</td></tr></tfooter></table></div> <!-- / calendarView --><div class="btm-bar"><span class="date-selected"><strong>Start Date</strong>August 6th, 2015</span><i class="flip-over"><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-chevron-right-128.png" title="Previous Month" width="25"></i></div> <!-- / Btm-Bar --></div> <!-- / calendarWrapper -->';return{restrict:"AE",scope:{config:"="},template:template,controller:CalendarController}}function Combobox(){function ComboboxController($scope){$scope.list=$scope.config.list,$scope.title=$scope.config.title,$scope.placeholder=$scope.config.placeholder,$scope.sort=$scope.config.sort,$scope.multi=$scope.config.multi,$scope.selectedItems=[],$scope.deleteSelection=function(item){var index=$scope.selectedItems.indexOf(item);$scope.selectedItems.splice(index,1)},$scope.addSelection=function(item){0==$scope.multi&&($scope.selectedItems=[]),-1==$scope.selectedItems.indexOf(item)&&$scope.selectedItems.push(item)},$scope.sortFunction=function(sortByName){return 1==$scope.sort?sortByName:void 0}}var template='<div class="combo-box" ng-class="{\'open\': inFocus}" ng-blur="inFocus = false"><label for="combo-input" class="input-label">{{title}}</label><input id="combo-input" type="text" ng-keypress="changed($event)" placeholder="{{placeholder}}" ng-focus="inFocus = true" ng-model="inputField"><div class="inputs"><label class="pill" ng-repeat="item in selectedItems | orderBy: sortFunction" ng-click="deleteSelection(item)">{{item}}<span class="close">&times;</span></label></div><div class="list" ng-show="inFocus"><ul><li ng-repeat="item in list | orderBy: sortFunction"><a href="#!" title="{{item}}" ng-click="addSelection(item)">{{item}}</a></li></ul></div></div>';return{restrict:"AE",scope:{config:"="},template:template,controller:ComboboxController}}function Chart($compile){function _buildBarSvg(width,height,data){var svg='<svg style="width:'+width+"px; height:"+height+'px;">';return angular.forEach(data,function(bar,index){var x=index*(width/data.length),y=height-bar,w=width/data.length;svg+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+bar+'" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"></rect>'}),svg+="</svg>"}function _controller($scope,$filter){var config={max:0,height:200,width:200,xLabel:void 0,yLabel:void 0};$scope.data=$scope.config.data||[],$scope.config=angular.extend({},config,$scope.config),$scope.type=$scope.config.type||"bar",$scope.template=templates[$scope.type]}function _compile(element,attrs){return{post:function(scope,element,attrs){var svgTag=angular.element(_buildBarSvg(scope.config.width,scope.config.height,scope.data));element.append(svgTag)}}}var templates={base:'<div class="chart" style="width:{{config.width}}px; height:{{config.height}}px;">   <div class="y" style="width:{{config.height}}px;">{{config.yLabel}}</div>   <div class="x">{{config.xLabel}}</div></div>',line:'<svg style="width:{{config.width}}px; height:{{config.height}}px;">   <line        ng-repeat="line in data"        ng-attr-x1="{{line.x1}}"       ng-attr-y1="{{line.y1}}"       ng-attr-x2="{{line.x2}}"       ng-attr-y2="{{line.y2}}">   </line></svg>',dot:'<div   ng-repeat="dot in data"   class="dot"   style="bottom:{{dot.value / max * height}}px; left:{{($index + 0.5) / data.length * width}}px;"></div>',bar:'<svg style="width:{{config.width}}px; height:{{config.height}}px;">   <rect        ng-repeat="bar in data"       x="{{$index * (config.width / data.length)}}"       y="{{config.height - bar}}"       data-index="{{$index}}"       width="{{config.width / data.length}}"       height="{{bar}}"       style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"></svg>'};return _controller.$inject=["$scope","$filter"],{restrict:"E",replace:!0,scope:{config:"="},template:templates.base,compile:_compile,controller:_controller}}function Input($compile){function _getTemplate(templateType){var template="";switch(templateType){case"prefix":template=templatePrefix;break;case"postfix":template=templatePostfix;break;case"counter":template=templateCounter;break;default:template=templateDefault}return template}function _controller($scope){var config={maxLength:0,height:200,width:200,type:"text",value:"",title:"title",currentLength:0};$scope.config=angular.extend({},config,$scope.config),$scope.data=$scope.config.value,$scope.valueChange=function(val){$scope.config.currentLength>=$scope.config.max&&($scope.config.value=$scope.config.value.substring(0,$scope.config.max-1)),$scope.config.currentLength=val.length}}var templateDefault='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> </div> </fieldset>',templatePrefix='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input class="prefix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> <span class="bossy-input-component bossy-input-prefix">{{config.prefixContent}}</span> </div> </fieldset>',templatePostfix='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input class="postfix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> <span class="bossy-input-component bossy-input-postfix">{{config.postfixContent}}</span> </div> </fieldset>',templateCounter='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <span class="counter"><span class="inc">{{config.currentLength}}</span>/{{config.max}}</span> <input class="postfix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}" ng-model="config.value" ng-change="valueChange(config.value)"/> <span></span> <span class="bossy-input-component bossy-input-postfix">{{config.postfixContent}}</span> </div> </fieldset>';return _controller.$inject=["$scope"],{restrict:"E",replace:!0,scope:{config:"="},link:function(scope,element,attrs){element.html(_getTemplate(scope.config.templateType)),$compile(element.contents())(scope)},template:templateDefault,controller:_controller}}function Navigation($q,$compile,$data){return{scope:{config:"="},link:function(scope,element,attrs){function buildMenu(menuObj){scope.menuObj=menuObj,scope.menuIdMap={},scope.rootSubMenus=[],assignMenuIds(scope.menuObj.navigation,scope.menuIdMap),angular.forEach(scope.menuObj.navigation,function(rootMenu){var subMenus={};getAllSubmenus(rootMenu,subMenus),scope.rootSubMenus.push(subMenus)})}!scope.config.menuObj&&!scope.config.menuUrl,$q.when($data.getData(scope.config.menuObj||scope.config.menuUrl)).then(function(menuObj){buildMenu(menuObj)}),scope.toggleOpen=function(menuId){scope.menuObj.activeMenuId=scope.menuObj.activeMenuId===menuId?void 0:menuId}},template:'<ul class="bossy-navbar"><li class="bossy-navbar-item" ng-repeat="rootMenu in menuObj.navigation"><a class="bossy-navbar-link" ng-if="rootMenu.url" href={{rootMenu.url}}>{{rootMenu.title}}</a><strong ng-if="rootMenu.subMenus" ng-click="toggleOpen(rootMenu.id)">{{rootMenu.title}}</strong><ul class="bossy-navbar-submenu" ng-repeat="(id, subMenu) in rootSubMenus[$index]" ng-show="menuObj.activeMenuId===id"><lh class="bossy-navbar-submenu-header" ng-show="id!==rootMenu.id" ng-click="toggleOpen(menuIdMap[id].parentId)">{{menuIdMap[id].title}}</strong></lh><li class="bossy-navbar-submenu-item" ng-repeat="item in subMenu"><a class="bossy-navbar-link" ng-if="item.url" href={{item.url}}>{{item.title}}</a><span ng-if="item.subMenus" ng-click="menuObj.activeMenuId=item.id">{{item.title}}</span></li></ul></li></ul>'}}function getUniqueId(){return"__"+nextId++}function assignMenuIds(menus,menuIdMap,parentMenu){angular.forEach(menus,function(menu){angular.isUndefined(parentMenu)||(menu.parentId=parentMenu.id),angular.isArray(menu.subMenus)&&(angular.isUndefined(menu.id)&&(menu.id=getUniqueId()),menuIdMap[menu.id]=menu,assignMenuIds(menu.subMenus,menuIdMap,menu))})}function getAllSubmenus(menu,subMenus){angular.isArray(menu.subMenus)&&(subMenus[menu.id]=menu.subMenus),angular.forEach(menu.subMenus,function(subMenu){getAllSubmenus(subMenu,subMenus)})}function Tooltip(){return{restrict:"E",scope:{config:"="},controller:TooltipController,transclude:!0,link:function(scope,elem,attr){if(scope.config.transclude===!0){for(var tooltipHtml=elem.find("div"),index=0;tooltipHtml.length&&!tooltipHtml.hasClass("tooltip-content");)tooltipHtml=tooltipHtml.find("div"),index++;tooltipHtml.length&&(scope.config.text=tooltipHtml.html(),tooltipHtml[index].remove()),scope.config.text||console.error("You must include content for tool tip.")}},template:'<span class="bossy-tooltip"><span class="link"><ng-transclude></ng-transclude><div class="bossy-tooltip-container {{config.color.toLowerCase()}} {{setActive(config.persist)}} {{setAlignment(config.align)}} {{setContentType(config.type)}} {{setPositioning(config.position)}}"><span ng-bind-html="config.text | bossyUnsafeHtml"></span><i ng-show="config.icon" class="icon ionicon {{config.icon.toLowerCase()}} {{setIconFloat(config.iconFloat)}}"></i><div ng-show="config.type.toLowerCase() === \'download\'" class="progress-bar" style="width: {{config.progress}}%"></div></div></span></span>'}}function TooltipController($scope){function initialize(){$scope.config.text||$scope.config.transclude===!0||console.error("You must include content for tool tip."),$scope.config||($scope.config={align:"center",position:"top",color:"black",type:"default",transclude:!1,persist:!1,progress:"0",icon:"",iconFloat:"left"})}$scope.setAlignment=function(alignment){var alignmentClass="";return alignment&&("left"===alignment.toLowerCase()?alignmentClass="bossy-tooltip-align-left":"right"===alignment.toLowerCase()&&(alignmentClass="bossy-tooltip-align-right")),alignmentClass},$scope.setActive=function(persist){var activeClass="";return persist&&(activeClass="active"),activeClass},$scope.setPositioning=function(position){var positionClass="";return position&&("left"===position.toLowerCase()?positionClass="bossy-tooltip-pos-left":"right"===position.toLowerCase()?positionClass="bossy-tooltip-pos-right":"bottom"===position.toLowerCase()&&(positionClass="bossy-tooltip-pos-bottom")),positionClass},$scope.setContentType=function(type){var contentType="";return type&&"download"===type.toLowerCase()&&(contentType="download"),contentType},$scope.setIconFloat=function(direction){var iconDirection="";return direction&&("left"===direction.toLowerCase()?iconDirection="icon-left":"right"===direction.toLowerCase()&&(iconDirection="icon-right")),iconDirection},initialize()}function Treeview($compile){var template='<ul class="bossy-treeview" ng-if="contents.nodes"><li ng-repeat="node in contents.nodes" ><span ng-if="node.node"><div class="bossy-treeview-nodeIcon bossy-treeview-collapsed" ng-click="nodeClicked($event, $index)" ng-class="showChildren($index) ? \'bossy-treeview-expanded\' : \'collapsed\'"> {{node.node.value}}</div><bossy-treeview ng-show="showChildren($index)" data="node.node"></bossy-treeview></span><span ng-if="node.item"><div class="bossy-treeview-fileIcon"ng-click="itemClicked($event, $index)">{{node.item.value}}<div class="bossy-treeview-content-type-{{node.item.type}}"><span ng-if="node.item.type">{{node.item.type}}</span></div></div></span></li></ul>';return{restrict:"AE",scope:{config:"=",data:"="},controller:TreeviewController,link:function(scope,elem,attr){elem.append($compile(template)(scope))}}}function TreeviewController($scope,$rootScope){$scope.config&&$scope.config.data&&($scope.data=$scope.config.data),$scope.contents={showingChildren:[],nodes:$scope.data.nodes},$scope.nodeClicked=function($event,$index){var indexInArr=$scope.contents.showingChildren.indexOf($index);indexInArr>-1?$scope.contents.showingChildren.splice(indexInArr,1):$scope.contents.showingChildren.push($index),$scope.changeSelection($event)},$scope.itemClicked=function($event,$index){$scope.changeSelection($event)},$scope.showChildren=function($index){return $scope.contents.showingChildren.indexOf($index)>-1?!0:!1},$scope.changeSelection=function($event){angular.isUndefined($rootScope.curSelectedTV)||$rootScope.curSelectedTV.toggleClass("bossy-treeview-selected"),$rootScope.curSelectedTV=angular.element($event.target),$rootScope.curSelectedTV.toggleClass("bossy-treeview-selected")}}function NavigationCtrl($scope){$scope.menu1Config={},$scope.menu1Config.menuObj={activeMenuId:"python",navigation:[{title:"Home",url:"http://www.bossyui.io/"},{title:"Resumes",menuId:"resumes",subMenus:[{title:"Technical",url:"https://www.linkedin.com/in/eddie-bracho-00b8ab84"},{title:"General",url:"https://www.linkedin.com/in/eddie-bracho-00b8ab84"}]},{title:"Projects",menuId:"projects",subMenus:[{title:"Python",menuId:"python",subMenus:[{title:"Artificial Neural Network",url:"https://github.com/ebracho/ANN"},{title:"Boolean Expression Interpreter",url:"https://github.com/ebracho/Boolean_Expression_Interpreter"},{title:"Tetris Clone",url:"https://github.com/ebracho/Tetris"},{title:"Irc Bot",url:"https://github.com/ebracho/kazbot"}]},{title:"Javascript",menuId:"javascript",subMenus:[{title:"Navigation",url:"https://github.com/ebracho/BossyUI/tree/NAVIGATION-170"},{title:"Autocomplete",url:"https://github.com/ebracho/BossyUI/tree/AUTOCOMPLETE-163"}]},{title:"C++",menuId:"c++",subMenus:[{title:"Matrix Library",url:"ebracho.com/projects/c++/matrix_library"}]}]},{title:"Github",url:"http://github.com/ebracho"}]},$scope.menu2Config={menuUrl:"templates/js/tigerdirect.json"}}function TooltipCtrl($scope){$scope.exp1Config={text:"This is default text in the tooltip"},$scope.exp2ConfigLeft={text:"This is default text in the tooltip",align:"left"},$scope.exp2ConfigRight={text:"This is default text in the tooltip",align:"right"},$scope.exp3ConfigGreen={text:"This is default text in the tooltip",color:"green"},$scope.exp3ConfigOrange={text:"This is default text in the tooltip",color:"orange"},$scope.exp3ConfigRed={text:"This is default text in the tooltip",color:"red"},$scope.exp3ConfigBlue={text:"This is default text in the tooltip",color:"blue"},$scope.exp4ConfigTop={text:"This is default text in the tooltip",position:"top"},$scope.exp4ConfigLeft={text:"This is default text in the tooltip",position:"left"},$scope.exp4ConfigRight={text:"This is default text in the tooltip",position:"right"},$scope.exp4ConfigBottom={text:"This is default text in the tooltip",position:"bottom"},$scope.exp5Config={text:"<b>Download File</b>",type:"download",color:"green",icon:"ion-ios-download-outline",progress:"40"}}angular.module("bossy.filters",[]).filter("bossyUnsafeHtml",function($sce){return function(val){return $sce.trustAsHtml(val)}});var bossy=angular.module("bossy",["bossy.filters","bossy.calendar","bossy.data","bossy.form","bossy.graph","bossy.input","bossy.schema","bossy.tooltip","bossy.autocomplete","bossy.combobox","bossy.navigation","bossy.treeview"]);Autocomplete.$inject=["BKTree","utility"],AutocompleteUtility.$inject=[],AutocompleteBKTree.$inject=["utility"],angular.module("bossy.autocomplete",[]).service("utility",AutocompleteUtility).factory("BKTree",AutocompleteBKTree).directive("bossyAutocomplete",Autocomplete),Calendar.$inject=[],CalendarController.$inject=["$scope"],angular.module("bossy.calendar",[]).controller("bossyCalendarController",CalendarController).directive("bossyCalendar",Calendar),Combobox.$inject=[],angular.module("bossy.combobox",[]).directive("bossyCombobox",Combobox),angular.module("bossy.form",[]).run(function($templateCache){$templateCache.put("bossy-input.html","templates/bossy-input.html")}).directive("bossyForm",["$compile","$http","$schema","$data",function($compile,$http,$schema,$data){function setData(data){var result=$data.getData(data);return angular.isFunction(result.then)&&angular.isFunction(result["catch"])&&angular.isFunction(result["finally"])?result:void(_data=result)}function setSchema(schema){_schema=$schema.getSchema(schema)}function buildTemplate(schemaPart,parentKey,required){var template="",fullKey="";return angular.forEach(schemaPart,function(value,key){if(value.type)switch(console.log(fullKey+" is "+value.type),value.type){case"object":var requiredList="undefined"!=typeof value.required?value.required:null;template+=buildTemplate(value.properties,fullKey,requiredList);break;case"array":template+=buildTemplate(value.items.properties,fullKey);break;case"number":template+=_itemTemplate.number(value);break;case"string":var isRequired=!1;required&&-1!==required.indexOf(key)&&(isRequired=!0),template+=_itemTemplate.text(value,key,isRequired);break;case"boolean":template+=_itemTemplate.checkbox(value)}},this),template}var _schema,_data,_options={showLabels:!0,header:"This is header",footer:"This is footer",theme:"green",button:"Save"},_itemTemplate={number:function(){return'<input type="number"/>'},text:function(obj,key,isRequired){return"<bossy-input title=\"'"+obj.title+"'\" type=\"'"+obj.inputType+"'\" value=\"'"+_data.address[key]+"'\""+(isRequired?" required":"")+"></bossy-input>"},textArea:function(){return"<textarea></textarea>"},checkbox:function(obj){return'<div class="checkbox"><label><input type="checkbox">'+obj.title+"</label></div>"}};return{restrict:"E",replace:!0,template:"",scope:{config:"=",title:"="},link:function(scope,element,attributes){scope.config.options=angular.extend(_options,scope.config.options);var promise=setData(scope.config.data);setSchema(scope.config.schema),promise?(promise.then(function(result){_data=result,element.html('<form novalidate class="{{config.options.theme}}"><div class="banner page-header"><h3>{{config.options.header}}</h3></div>'+buildTemplate(_schema)+'<button ng-if="config.options.button">{{config.options.button}}</button><div class="page-footer"><h3>{{config.options.footer}}</h3></div></form>'),$compile(element.contents())(scope)},function(reason){}),element.html('<form novalidate class="{{config.options.theme}}">LOADING...</form>'),$compile(element.contents())(scope)):(element.html('<form novalidate class="{{config.options.theme}}"><div class="banner page-header"><h3>{{config.options.header}}</h3></div>'+buildTemplate(_schema)+'<button ng-if="config.options.button">{{config.options.button}}</button><div class="page-footer"><h3>{{config.options.footer}}</h3></div></form>'),$compile(element.contents())(scope))}}}]),Chart.$inject=["$compile"],angular.module("bossy.graph",[]).directive("bossyGraph",Chart),Input.$inject=["$compile"],angular.module("bossy.input",[]).directive("bossyInput",Input),Navigation.$inject=["$q","$compile","$data"];var nextId=0;angular.module("bossy.navigation",["bossy.data"]).directive("bossyNavigation",Navigation),Tooltip.$inject=[],TooltipController.$inject=["$scope"],angular.module("bossy.tooltip",["bossy.filters"]).controller("bossyTooltipController",TooltipController).directive("bossyTooltip",Tooltip),Treeview.$inject=["$compile"],TreeviewController.$inject=["$scope","$rootScope"],angular.module("bossy.treeview",["bossy.filters"]).controller("bossyTreeviewController",TreeviewController).directive("bossyTreeview",Treeview),angular.module("bossy.data",[]).factory("$data",["$q","$http",function($q,$http){function _getData(data){return angular.isString(data)?_getRemoteData(data):angular.isObject(data)?data:void console.error("$data: no data url or object given")}function _getRemoteData(data){var deferred=$q.defer();return $http.get(data,{responseType:"json"}).success(function(data){angular.isObject(data)?deferred.resolve(data):(deferred.reject("$data: GET request to url did not produce data object"),console.log(data))}).error(function(responseData,status){deferred.reject('$data: GET request to url "'+data+'" failed with status "'+status+'"')}),deferred.promise}return{getData:_getData}}]),angular.module("bossy.schema",[]).factory("$schema",["$q","$http",function($q,$http){function _getSchema(schema){return angular.isString(schema)?_getRemoteSchema(schema):angular.isObject(schema)?schema:void console.error("directive.bossyForm: no schema url or object given")}function _getRemoteSchema(schema){var deferred=$q.defer();return $http.get(schema).success(function(data){angular.isObject(data)?deferred.resolve(data):deferred.reject("directive.bossyForm: GET request to url did not produce schema object")}).error(function(data,status){deferred.reject('directive.bossyForm: GET request to url "'+schema+'" failed with status "'+status+'"')}),deferred.promise}return{getSchema:_getSchema}}]),angular.module("autocomplete",[]).controller("AutocompleteCtrl",["$scope",function($scope){var fiftyStates=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];$scope.ex1Config={dict:fiftyStates},$scope.ex2Config={dict:fiftyStates,maxCorrections:3,maxSuggestions:8}}]),angular.module("navigation",[]).controller("NavigationCtrl",NavigationCtrl),angular.module("tooltip",[]).controller("TooltipCtrl",TooltipCtrl);
//# sourceMappingURL=../maps/bossy.all.js.map
