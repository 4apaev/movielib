module.exports = (Mims => {
  'use strict';

  const $ = Symbol('mims')
  const Path = require('path');
  const Mim = {
      [ $ ]: Object.create(null),

      get(x, fallback) {
          const ext = Path.extname(x).slice(1).toLowerCase()
          return this[ $ ][ ext ] || fallback || 'plain/text'
        },

      set(ext, type) {
          this[ $ ][ ext.toLowerCase() ] = type
          return this
        }
     }

  for(let type in Mims) {
      for (let types = Mims[ type ], i=0; i < types.length; i++)
        Mim.set(types[ i ], type)
      Mim.set(type, type)
    }

  return Mim
})({
  "application/ecmascript"         : [ "ecma" ],
  "application/javascript"         : [ "js" ],
  "application/json"               : [ "json", "map" ],
  "application/octet-stream"       : [ "bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "buffer" ],
  "application/pdf"                : [ "pdf" ],

  "application/x-tar"              : [ "tar" ],
  "application/zip"                : [ "zip" ],

  "application/xml"                : [ "xml", "xsl", "xsd" ],
  "application/xhtml+xml"          : [ "xhtml", "xht" ],
  "application/rss+xml"            : [ "rss" ],

  "font/opentype"                  : [ "otf" ],
  "application/font-tdpfr"         : [ "pfr" ],
  "application/font-woff"          : [ "woff" ],
  "application/font-woff2"         : [ "woff2" ],
  "application/x-font-bdf"         : [ "bdf" ],
  "application/x-font-otf"         : [ "otf" ],
  "application/x-font-pcf"         : [ "pcf" ],
  "application/x-font-snf"         : [ "snf" ],
  "application/x-font-ttf"         : [ "ttf", "ttc" ],
  "application/x-font-type1"       : [ "pfa", "pfb", "pfm", "afm" ],
  "application/x-font-ghostscript" : [ "gsf" ],
  "application/x-font-linux-psf"   : [ "psf" ],

  "image/bmp"                      : [ "bmp" ],
  "image/gif"                      : [ "gif" ],
  "image/jpeg"                     : [ "jpeg", "jpg", "jpe" ],
  "image/png"                      : [ "png" ],
  "image/svg+xml"                  : [ "svg", "svgz" ],
  "image/tiff"                     : [ "tiff", "tif" ],
  "image/x-icon"                   : [ "ico" ],
  "text/vcard"                     : [ "vcard" ],
  "text/x-vcalendar"               : [ "vcs" ],
  "text/x-vcard"                   : [ "vcf" ],
  "text/css"                       : [ "css" ],
  "text/csv"                       : [ "csv" ],
  "text/html"                      : [ "html", "htm" ],
  "text/jade"                      : [ "jade" ],
  "text/less"                      : [ "less" ],
  "text/plain"                     : [ "txt", "text", "conf", "def", "list", "log", "in", "ini" ],
  "text/stylus"                    : [ "stylus", "styl" ],
  "text/coffeescript"              : [ "coffee" ],
  "text/x-markdown"                : [ "markdown", "md", "mkd" ],
  "text/x-sass"                    : [ "sass" ],
  "text/x-scss"                    : [ "scss" ],
  "text/x-handlebars-template"     : [ "hbs" ],
  "text/yaml"                      : [ "yaml", "yml" ]
})