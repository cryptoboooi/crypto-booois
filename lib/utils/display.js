const { inspect } = require('util')
const proggy = require('proggy')
const log = require('proc-log')
const { explain } = require('./explain-eresolve.js')
const { formatWithOptions, format } = require('./format')

const COLOR_PALETTE = ({ chalk: c }) => ({
  heading: c.white.bgBlack,
  title: c.magenta,
  timing: c.green.bgBlack,
  // loglevels
  error: c.red.bgBlack,
  warn: c.black.bgYellow,
  notice: c.blue.bgBlack,
  http: c.green.bgBlack,
  info: c.green,
  verbose: c.blue.bgBlack,
  silly: c.inverse,
})

const LEVELS = ['timing', ...log.LEVELS].reduce((acc, key) => {
  acc[key] = key
  return acc
}, {})

const LEVEL_OPTIONS = {
  silent: {
    index: 0,
  },
  error: {
    index: 1,
    label: 'ERR!',
  },
  warn: {
    index: 2,
    label: 'WARN',
  },
  notice: {
    index: 3,
  },
  http: {
    index: 4,
  },
  info: {
    index: 5,
  },
  verbose: {
    index: 6,
    label: 'verb',
  },
  silly: {
    index: 7,
    label: 'sill',
  },
}

const LEVEL_METHODS = {
  ...LEVEL_OPTIONS,
  [LEVELS.timing]: {
    show: ({ timing, index }) => !!timing && index !== 0,
  },
}

const safeJsonParse = (maybeJsonStr) => {
  if (typeof maybeJsonStr !== 'string') {
    return maybeJsonStr
  }
  try {
    return JSON.parse(maybeJsonStr)
  } catch {
    return maybeJsonStr
  }
}

class Display {
  // pause by default until config is loaded
  #paused = true

  // buffers to store logs when paused
  #logBuffer = []
  #outputBuffer = []

  // colors
  #chalk = null
  #colors = null

  // progress
  #progress = null

  // options
  #levelIndex = 0
  #timing = false
  #json = false
  #heading = 'npm'

  #stdout = null
  #stderr = null

  constructor ({ stdout, stderr }) {
    this.#stdout = stdout
    this.#stderr = stderr
    process.on('log', this.#logHandler)
  }

  off () {
    process.off('log', this.#logHandler)
    this.#logBuffer.length = 0
    if (this.#progress) {
      this.#progress.stop()
    }
  }

  load ({ loglevel, chalk, timing, unicode, progress, json, heading }) {
    this.#chalk = chalk
    this.#colors = COLOR_PALETTE({ chalk })

    this.#levelIndex = LEVEL_OPTIONS[loglevel].index
    this.#timing = timing
    this.#json = json
    this.#heading = heading

    if (this.#levelIndex <= 0) {
      this.off()
    } else {
      log.resume()
      if (progress) {
        this.#startProgress({ unicode })
      }
    }
  }

  logTiming (...args) {
    this.#logHandler(LEVELS.timing, ...args)
  }

  forceLog (level, ...args) {
    // TODO: check if this currently bypasses silent and make it do the same here
    this.#logHandler({ level, force: true }, ...args)
  }

  output (...args) {
    // TODO: make this respect silent option
    this.#stdout.write(format(...args))
  }

  outputError (...args) {
    this.#stderr.write(format(...args))
  }

  outputBuffer (item) {
    this.#outputBuffer.push(item)
  }

  flushOutput (jsonError) {
    if (!jsonError && !this.#outputBuffer.length) {
      return
    }

    if (this.#json) {
      const output = this.#outputBuffer.reduce((a, i) => ({ ...a, ...safeJsonParse(i) }), {})
      this.output(JSON.stringify({ ...output, ...jsonError }, null, 2))
    } else {
      this.#outputBuffer.forEach((item) => this.output(item))
    }

    this.#outputBuffer.length = 0
  }

  #write (...args) {
    const { level: levelName, force = false } = typeof args[0] === 'string'
      ? { level: args[0] } : args[0]

    if (levelName === LEVELS.pause) {
      this.#paused = true
      return
    }

    if (levelName === LEVELS.resume) {
      this.#paused = false
      this.#logBuffer.forEach((item) => this.#write(...item))
      this.#logBuffer.length = 0
      return
    }

    if (this.#paused) {
      this.#logBuffer.push(args)
      return
    }

    const level = LEVEL_METHODS[levelName]
    const show = level.show ?? (({ index }) => level.index <= index)

    if (force || show({ index: this.#levelIndex, timing: this.#timing })) {
      // this mutates the array so we can pass args directly to format later
      const [, title] = args.splice(0, 2)
      const prefix = [
        this.#colors.heading(this.#heading),
        this.#colors[levelName](level.label ?? levelName),
        title ? this.#colors.title(title) : null,
      ]
      this.#stderr.write(formatWithOptions({ prefix }, ...args))
    } else if (this.#progress) {
      // TODO: make this display a single log line of filtered messages
    }
  }

  #logHandler = (level, ...args) => {
    try {
      this.#log(level, ...args)
    } catch (ex) {
      try {
        // if it crashed once, it might again!
        this.#write(LEVELS.verbose, `attempt to log ${inspect(args)} crashed`, ex)
      } catch (ex2) {
        // eslint-disable-next-line no-console
        console.error(`attempt to log ${inspect(args)} crashed`, ex, ex2)
      }
    }
  }

  #log (...args) {
    if (args.length === 4) {
      const [level, heading, message, expl] = args
      if (level === LEVELS.warn && heading === 'ERESOLVE' && expl && typeof expl === 'object') {
        // Also (and this is a really inexcusable kludge), we patch the
        // log.warn() method so that when we see a peerDep override
        // explanation from Arborist, we can replace the object with a
        // highly abbreviated explanation of what's being overridden.
        // TODO: this could probably be moved to arborist now that display is refactored
        this.#write(level, heading, message)
        this.#write(level, '', explain(expl, this.#chalk, 2))
        return
      }
    }
    this.#write(...args)
  }

  #startProgress ({ unicode }) {
    this.#progress = proggy.createClient({ normalize: true })
    // TODO: implement proggy trackers in arborist/doctor
    // TODO: listen to progress events here and build progress UI
    // TODO: see deprecated gauge package for what unicode chars were used
  }
}

module.exports = Display
