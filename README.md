# Vue3 Overflow List Demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/fdcb4418-ab58-449b-bfdc-3fb1a53cd100/deploy-status)](https://app.netlify.com/sites/vue3-overflow-list/deploys)

implement reference [semi-design](https://semi.design/zh-CN/show/overflowlist)

🥳 [site demo](https://vue3-overflow-list.netlify.app/)

## problems

When rendering for the first time, the container will render all the elements, and then fetch and execute the allocation. There will be a short flash of container overflow

## characteristic

- support big children ([semi-design react setState limit 50](https://github.com/palantir/blueprint/issues/3792))
