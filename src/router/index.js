import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Dinner from '@/pages/Dinner'
import Order from '@/components/Order'
import Bill from '@/components/Bill'
import Member from '@/components/Member'
import More from '@/pages/More'
import OrderTable from '@/pages/OrderTable'
import EquipmentStatus from '@/components/EquipmentStatus'
import PrintSet from '@/components/PrintSet'
import ProdClear from '@/components/ProdClear'
import SystemSet from '@/components/SystemSet'
import ChangePwd from '@/components/ChangePwd'
import Help from '@/components/Help'
import Pay from '@/components/Pay'
import Shift from '@/components/Shift'
import ChangeTable from '@/components/ChangeTable'
import Authority from '@/components/public/Authority'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login,
      meta: { 
        requireLogin: true
      }
    },{
    	path:'/dinner',
      	component: Dinner,
        meta: { 
          requireAuth: true
        },
      	children: [
        {         
          path: '',
          component: Order,
          meta: { 
            requireAuth: true
          },
          children: [
        {         
          path: 'changeTable',
          component: ChangeTable,
          meta: { 
            requireAuth: true
          },
        }]
        },{         
          path: 'bill',
          meta: { 
            requireAuth: true
          },
          component: Bill
        },
        {         
          path: 'member',
          meta: { 
            requireAuth: true
          },
          component: Member,
          children: [{         
            path: 'pay',
            meta: { 
              requireAuth: true
            },
            component: Pay
          }]
        },
        {         
          path: 'shift',
          meta: { 
            requireAuth: true
          },
          component: Shift
        },{         
          path: '*',  
          meta: { 
            requireAuth: true
          },        
          component: Order
        }
      ]
    },
    {
      path:"/orderTable",
      meta: { 
        requireAuth: true
      },
      component:OrderTable,
      children:[
      {
        path:'pay',
        meta: { 
          requireAuth: true
        },
        component:Pay
      }]
    },{
      path:"/more",
      component:More,
      meta: { 
        requireAuth: true
      },
      children: [
        {         
          path: '',
          meta: { 
            requireAuth: true
          },
          component: EquipmentStatus
        },{         
          path: 'printSet',
          meta: { 
            requireAuth: true
          },
          component: PrintSet
        },{         
          path: 'prodClear',
          meta: { 
            requireAuth: true
          },
          component: ProdClear
        },{         
          path: 'systemSet',
          meta: { 
            requireAuth: true
          },
          component: SystemSet
        },{         
          path: 'changePwd',
          meta: { 
            requireAuth: true
          },
          component: ChangePwd
        },{         
          path: 'help',
          meta: { 
            requireAuth: true
          },
          component: Help
        }]
    }
  ]
})
