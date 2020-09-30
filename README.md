# lua_function_annotation
So annoying to copy function name and params


Step 1  npm install
Step 2  npm i vsce -g
Step 3  vsce package
Step 4  Extensions select Install from VSIX; Then install the generated vsix package


then you can input "antt" on the top of the lua function name
eg.

"antt" + enter
function abc:generateAnnotation(param1,param2)

end


if will generate to 

-- ************************************************************
-- generateAnnotation
-- @param1
-- @param2
-- ************************************************************
function abc:generateAnnotation(param1,param2)

end