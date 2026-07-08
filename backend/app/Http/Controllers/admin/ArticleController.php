<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Validator;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    //This method will return all articles
    public function index(){
        $artilces = Article::orderBy('created_at','DESC')->get();
        return response()->json([
            'status'=>true,
            'data'=> $artilces
        ]);
    }

    //This method will store the article
    public function store(Request $request)
    {
        $request->merge([
            'slug' => Str::slug($request->slug)
        ]);

        $validate = Validator::make($request->all(), [
            'title' => 'required',
            'slug'  => 'required|unique:articles,slug',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validate->errors()
            ]);
        }

        $article = new Article();
        $article->title = $request->title;
        $article->slug = $request->slug;
        $article->content = $request->content;
        $article->author = $request->author;
        $article->status = $request->status;
        $article->save();

        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);

                $fileName = time() . $article->id . '.' . $ext;

                $sourcePath = public_path('uploads/temp/' . $tempImage->name);

                // Small image
                $smallPath = public_path('uploads/articles/small/' . $fileName);

                $manager = new ImageManager(new Driver());
                $image = $manager->read($sourcePath);
                $image->cover(300, 300);
                $image->toJpeg(90)->save($smallPath);

                // Large image
                $largePath = public_path('uploads/articles/large/' . $fileName);

                $image = $manager->read($sourcePath);
                $image->scaleDown(width: 1200);
                $image->toJpeg(90)->save($largePath);

                $article->image = $fileName;
                $article->save();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Article Added Successfully'
        ]);
    }

    //This method will update the article
    public function update(Request $request, $id){
        
        $article = Article::find($id);
        if($article == null){
            return response()->json([
                'status'=>false,
                'message'=>'Article not found'
            ]);
        }
        $request->merge(['slug' => Str::slug($request->slug)]);

        $validate = Validator::make($request->all(),[
            'title'=>'required',
            'slug'=>'required|unique:articles,slug,'.$id.',id',
        ]);

        if($validate->fails()){
            return response()->json([
                'status'=> false,
                'errors'=>$validate->errors(),
            ]);
        }

        $article->title = $request->title;
        $article->slug = Str::slug($request->slug);
        $article->author = $request->author;
        $article->content = $request->content;
        $article->status = $request->status;
        $article->save();

        if($request->imageId > 0){
            $oldImage = $article->image;
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now').$article->id.'.'.$ext;

                //Create Small Thumbnail Here
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $desPath = public_path('uploads/articles/small/'.$fileName);
                $manager = new ImageManager(new Driver());
                $image = $manager->read($sourcePath);
                $image->cover(300, 300);
                $image->toJpeg(90)->save($desPath);

                //Create Large Thumbnail Here
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $desPath = public_path('uploads/articles/large/'.$fileName);
                $manager = new ImageManager(new Driver());
                $image = $manager->read($sourcePath);
                $image->scale(1200);
                $image->toJpeg(90)->save($desPath);

                $article->image = $fileName;
                $article->save();

                if($oldImage != ''){
                  File::delete(public_path('uploads/articles/large/'.$oldImage));
                  File::delete(public_path('uploads/articles/small/'.$oldImage));
                }
            }
        }

        return response()->json([
            'status'=> true,
            'message'=>'Article Updated successfully',
        ]);
    }

    //This methid will delete the article
    public function destroy($id){
        
        $article = Article::find($id);
        

        if($article === null){
            return reponse()->json([
                'status'=> false,
                'message'=>'Article Not found'
            ]);
        }

        File::delete(public_path('uploads/articles/large/'.$article->image));
        File::delete(public_path('uploads/articles/small/'.$article->image));

        $article->delete();

        return response()->json([
            'status'=>true,
            'message'=> 'Article Deleted Successfully'
        ]);
    }
}
