# _Images-Gallery_

##_Demo: [here]()_

##_History of my way solution:_

The task turned out to be much more difficult than I thought.

I tried flex - and grid-markup, but did not get the desired result.

I also found a simple and elegant solution using the column-count CSS property. However, with this approach, the images will be lined up in several columns of the same width. This contradicts one of the points of the terms of reference.

I also found a ready-made [solution](http://neptunian.github.io/react-photo-gallery/) that copes with the task very easily. However, it is difficult to develop such a solution for one person in a short time.

So I was looking for another solution and settled on a system of equations. According to the grid that was attached to the technical task, the sum of the widths of all elements in the row is equal to the width of the container. And the height of all the elements in the row should be the same. Knowing the initial proportions of the images and the width of the container, we get a system of equations:

![A system of equations](https://firebasestorage.googleapis.com/v0/b/upload-files-9d7e9.appspot.com/o/images%2Fcoeff.jpg?alt=media&token=10771ebb-11d9-4ba0-8448-f59907bc5e91)

Having solved this system of equations, I found the coefficients 
for each image and applied flex markup expressed as a percentage, 
as well several breakpoints.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
