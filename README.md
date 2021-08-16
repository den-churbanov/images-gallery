## _Images-Gallery_

#### _Demo: [here](https://images-gallery-4f5b2.web.app/)_

## _How I came to my solution:_

#### _To check the task requirements, open the current [Trello](https://trello.com/b/7Irt4fJv) board_

The task turned out to be much more difficult than I thought.

I tried flex - and grid-markup, but did not get the desired result.

I also found a simple and elegant solution using the column-count CSS property. However, with this approach, the images will be lined up in several columns of the same width. This contradicts one of the points of the terms of reference.

I also found a ready-made [solution](https://codesandbox.io/s/9yx911wl9y?file=/index.js) that copes with the task very easily. However, it is impossible to develop such a solution for one person in a short time.

So I was looking for another solution and settled on a system of equations. According to the grid that was attached to the technical task, the sum of the widths of all elements in the row is equal to the width of the container. And the height of all the elements in the row should be the same. Knowing the initial proportions of the images and the width of the container, we get a system of equations:

![A system of equations](https://firebasestorage.googleapis.com/v0/b/upload-files-9d7e9.appspot.com/o/hidden%2Fcoeff.jpg?alt=media&token=7044dc31-5e21-4c7d-84f9-fd42a0e6e16b)

Having solved this system of equations, I found the coefficients 
for each image and applied flex markup expressed as a percentage, 
as well several breakpoints.

## _Run and Build Scripts_

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
