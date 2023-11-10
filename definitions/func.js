var TITLE = { text: '# Intro', method: '# Methods', property: '# Property', event: '# Events', rest: '# REST', faq: '# FAQs' }
var md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
  });
    
FUNC.group = function(items, callback) {
    var active = {};
    var groups = [];
    var output = {};
    var index = 0;
    items.wait(function (item, next) {
        var slug = item.group.slug();
        if (item.group.length === 0) {
            var obj = {};
            item.group = 'custom-totaljs'
            obj.name = item.group;
            obj.count = 1;
            obj.items = [item];
            output[slug] = obj;
            active = item;
            next();
            return;
        };
            

        if (!output[slug]) {
            var obj = {};
            obj.name = item.group;
            obj.count = 1;
            obj.items = [item];
            output[slug] = obj;
            groups.push({ linker: slug, name: item.group });
        } else {
            output[slug].count++;
            output[slug].items.push(item);
        }

        index++;
        next();
    }, function() {
        callback && callback({ groups, items: output, active });
    });
}

FUNC.merge_pages = function(pages, callback) {
    
    var output = {};
    output.text = '';
    output.property = '';
    output.method = '';
    output.event = '';
    output.rest = '';
    output.faq = '';

    pages.wait(function(page, next) {


        switch(page.type) {
            case 'text':  
                output.text += '\n\n\n{0}'.format(page.body); 
                break;
            case 'method':
                output.method += '\n\n{0}'.format(page.body);
                break;
            case 'property':
                output.property += '\n\n{0}'.format(page.body);
                break;
            case 'event':
                output.event += '\n\n{0}'.format(page.body);
                break;
            case 'rest':
                output.rest += '\n\n{0}'.format(page.body);
                break;
            case 'faq':
                output.faq += '\n\n'.format(page.body);
                break;
        }
        next();
    }, function() {

        var str = '';

        for (var k of Object.keys(output)) {
            if (output[k].length > 0)
                str += TITLE[k] + '\n\n\n' + output[k]; 
        }

        callback && callback(str);
    })

};


FUNC.md2html = function(str) {
    return new Promise(function(resolve) {
        resolve(str.markdown({ wrap: true }));
    });
}