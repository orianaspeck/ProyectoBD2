
window.onload=function(){

    new Vue({
      el: '#app',
      data: () => ({
        days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'].map(e => ({
          name: e,
          hours: Array(12).fill(0).map((e, i) => ({
            index: 7 + i,
            selected: false,
          }))
        }))
      }),
      // No methods right now.
      methods: {
    
        select(e) { 
            e.selected = !e.selected;
       },
       
      }
    });
    
    }