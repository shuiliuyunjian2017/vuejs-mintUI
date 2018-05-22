import listArticlepaper from './listArticlepaper'
import detailArticlepaper from './detailArticlepaper'

export default [
    {path : '/listArticlepaper', name : 'listArticlepaper', component : listArticlepaper},
    {path : '/detailArticlepaper/:paperId', name : 'detailArticlepaper', component : detailArticlepaper},
]
