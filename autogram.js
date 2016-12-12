//create object
var casper = require('casper').create()

//xpath
var x = require('casper').selectXPath;

//requore fs to append urls to a text file
var fs = require('fs');


//create user agent
casper.userAgent('Mozilla/4.0 (comptible; MSIE 6.0; Windows NT 5.1)')

//========================================
//========================================
//========================================

var tag = 'fishing'              //put your tag here
var userName = 'johnsmith99'         //put your username here
var pass = 'password123'             //put your password here


//========================================
//========================================
//========================================

var fullURL;


casper.start();

logIn();


//Log In
function logIn(){

    casper.thenOpen('https://www.instagram.com/accounts/login/', function() {

        //wait to load then input username/pass
        this.wait(3000,function(){

            var userNamePath = '//*[@id="react-root"]/div/article/div/div[1]/div/form/div[1]/input'

            var passPath = '//*[@id="react-root"]/div/article/div/div[1]/div/form/div[2]/input'

            var logInBtn = '//*[@id="react-root"]/div/article/div/div[1]/div/form/span/button';


            this.sendKeys(x(userNamePath), userName);

            this.sendKeys(x(passPath), pass);

            this.capture('1usernamePass.png');

            this.click(x(logInBtn))

        })//wait



        this.wait(2000,function(){
            this.capture('2LoggedIn.png')
            getURL()
        })//wait

    });//casperOpen

}; //logIn





//generate a url to like every 30-60 seconds
function getURL(){

    casper.reload();

    casper.thenOpen('https://www.instagram.com/explore/tags/'+tag+'/?hl=en', function() {

        //random time between 30sec to 1min;
        var randomTime = (Math.random() * 30000) + 30000;

        this.wait(randomTime, function(){

            //select first div in Most Recent section
            var myXpath = x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div[1]/a[1]')

            //get the page URL  returns /p/BN45ZX5At9B/
            var pageURL = this.getElementAttribute(myXpath, 'href');

            //fullURL is https://www.instagram.com/p/BN45ZX5At9B/
            fullURL = 'https://www.instagram.com' + pageURL

            //put url in likedLinks.txt
            console.log(fullURL)
            fs.write('likedLinks.txt', fullURL + '\n', 'a');


            go2likePage();

        })//wait

    });//start
}




function go2likePage(){

    casper.thenOpen(fullURL, function(){
        this.capture('3newPage.png')
        clickLike();
    })
}



function clickLike(){

    var likeBtn = '//*[@id="react-root"]/section/main/div/div/article/div[2]/section[2]/a/span'
    casper.thenClick(x(likeBtn));
    casper.wait(2000,function(){
        this.capture('4like.png')
        getURL();
    })//wait
}






casper.run();
