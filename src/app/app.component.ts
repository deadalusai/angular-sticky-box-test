import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  let optimizedResize = (function() {

    var callbacks = [],
      running = false;

    // fired on resize event
    function resize() {

      if (!running) {
        running = true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(runCallbacks);
        } else {
          setTimeout(runCallbacks, 66);
        }
      }

    }

    // run the actual callbacks
    function runCallbacks() {

      callbacks.forEach(function(callback) {
        callback();
      });

      running = false;
    }

    // adds callback to loop
    function addCallback(callback) {

      if (callback) {
        callbacks.push(callback);
      }

    }

    return {
      // public method to add additional callback
      add: function(callback) {
        if (!callbacks.length) {
          window.addEventListener('resize', resize);
        }
        addCallback(callback);
      }
    }
  }());

// start process
  optimizedResize.add(function() {

    let windowHeight = window.innerHeight;
    let headerHeight = document.getElementById('header').offsetHeight;
    let footerHeight = document.getElementById('footer').offsetHeight;
    let aside = document.getElementById('aside');
    let asideHeight = windowHeight - headerHeight - footerHeight;

    // console.log('windowHeight: ', windowHeight, ', headerHeight: ', headerHeight, ', footerHeight: ', footerHeight);
    aside.setAttribute('style', 'height: ' + asideHeight + 'px; background: rgba(255,0,255,0.2);');
  });
}
