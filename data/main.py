from pyquery import PyQuery as pq
from lxml import etree
import urllib


def get_subtitles(url):
    url = "http://keepsubs.com?url=" + url
    d = pq(url= url)

    return d("a.l")[0].attr('href')


video_url = "https://www.youtube.com/watch?v=C4yHka_Nezc"

print get_subtitles(video_url)