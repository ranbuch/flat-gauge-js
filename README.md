# flat-gauge-js

### not ready for use yet (WIP) . . .

## installation
npm
```
npm install flat-gauge-js --save
```
bower
```
bower install flat-gauge-js -S
```


include script:
```
<script type="text/javascript" src="node_modules/flat-gauge-js/dist/bundle.js"></script>
```

## Examples
[link](https://ranbuch.github.io/flat-gauge-js/)


## Spinner Example
```javascript
var target = document.getElementById('target');

new FlatGauge.Spinner(target, {
    rotationSpeed: 1000,
    title: {
      text: 'Spinning'
    }
  });
```
### Options
```javascript
{
    colors: {
        default: string;
        active: string;
        inactive: string;
    };
    activeDegree: number;
    radius: number;
    strokeWidth: number;
    rotationSpeed: number;
    title: {
        text: string;
        fontSize: number;
        fontFamily: string;
        lineHeight: number;
        fontWeight: string;
        letterSpacing: string;
    };
    animationDuration: number;
    highlight: boolean;
}
```

## Tune Example
```javascript
var target = document.getElementById('target');

var tune = new FlatGauge.Tune(target, {
    rotationSpeed: 1000,
    title: {
      text: 'Tune'
    }
  });

setTimeout(() => {
    tune.update({iconOptions: {degree: 0, src: '{pathToImage}'},edges: true, hideBottom: true,needleOptions: {edges: false,minMaxVal: {value: 25, min: 40, max: 80}}});
}, 5000);
```
### Options
```javascript
{
    needleOptions: {
        color: string;
        minMaxVal: {
            min: number;
            max: number;
            value: number;
        };
        radius: number;
        scale: number;
        animationDuration: number;
    };
    iconOptions: {
        degree: number;
        radius: number;
        animationDuration: number;
        src: string;
        dimensions: {
            width: number;
            height: number;
        },
        opacity: number;
    };
    colors: {
        default: string;
        active: string;
        inactive: string;
    };
    strokeWidth: number;
    animationDuration: number;
    radius: number;
    showEdges: boolean;
    hollowEdges: number; // ENUM: None = 0,Left = 1,Right = 2,Both = 3
    showIcon: boolean;
    hideBottom: boolean;
}

```

## Timer Example
```javascript
var target = document.getElementById('target');

var timer = new FlatGauge.Timer(target, {
    animationDuration: 500,
    time: {
        hours: 2,
        minutes: 45,
        seconds: 3
    },
    percentage: 33
});
```
### Options
```javascript
{
    colors: {
        default: string;
        active: string;
        inactive: string;
    };
    strokeWidth: number;
    time: {
        hours: number,
        minutes: number,
        seconds: number,
    };
    animationDuration: number;
    radius: number;
    showEdges: boolean;
    title: {
        text: string;
        fontSize: number;
        fontFamily: string;
        lineHeight: number;
        fontWeight: string;
        letterSpacing: string;
    };
    percentage: number;
}
```

## AM-PM Example (Not Ready)
```javascript
var target = document.getElementById('target');
var ampm = new FlatGauge.AmPm(target);
```
### Options
```javascript
{
    fromTo: {
        from: string;
        to: string;
    };
    needleOptions: {
        color: string;
        minMaxVal: {
            min: number;
            max: number;
            value: number;
        };
        radius: number;
        scale: number;
        animationDuration: number;
    };
    colors: {
        default: string;
        active: string;
        inactive: string;
    };
    radius: number;
    minMaxValAm: {
        min: number;
        max: number;
        value: number;
    };
    minMaxValPm: {
        min: number;
        max: number;
        value: number;
    };
    animationDuration: number;
    strokeWidth: number;
}
```

## Range Example
```javascript
var target = document.getElementById('target');
var range = new FlatGauge.Range(target);
```
### Options
```javascript
{
    needleOptions?: NeedleOptions;
    iconOptions?: IconOptions;
    colors?: ColorPalette;
    strokeWidth?: number;
    // title?: InnerText;
    animationDuration?: number;
    radius: number;
    showEdges: boolean;
    hollowEdges?: SideState;
    showIcon: boolean;
    hideBottom: boolean;
}
```