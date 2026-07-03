<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProjectController extends Controller
{
    //This method will return all projects
    public function index(){

        $projects = Project::orderBy('created_at','DESC')->get();
        return response()->json([
            'status'=>true,
            'data'=>$projects
        ]);

    }

    //This method will add the projects
    public function store(Request $request){

        $request->merge(['slug' => Str::slug($request->slug)]);

        $validate = Validator::make($request->all(),[
            'title'=>'required',
            'slug'=>'required|unique:projects,slug',
        ]);

        if($validate->fails()){
            return response()->json([
                'status'=> false,
                'errors'=>$validate->messages(),
            ]);
        }

        $project = new Project();
        $project->title = $request->title;
        $project->slug = Str::slug($request->slug);
        $project->short_desc = $request->short_desc;
        $project->content = $request->content;
        $project->construction_site = $request->construction_site;
        $project->sector = $request->sector;
        $project->location = $request->location;
        $project->status = $request->status;
        $project->save();

        if($request->imageId > 0){
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now').$project->id.'.'.$ext;

                //Create Small Thumbnail Here
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $desPath = public_path('uploads/projects/small/'.$fileName);
                $manager = new ImageManager(new Driver());
                $image = $manager->read($sourcePath);
                $image->cover(300, 300);
                $image->toJpeg(90)->save($desPath);

                //Create Large Thumbnail Here
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $desPath = public_path('uploads/projects/large/'.$fileName);
                $manager = new ImageManager(new Driver());
                $image = $manager->read($sourcePath);
                $image->scale(1200);
                $image->toJpeg(90)->save($desPath);

                $project->image = $fileName;
                $project->save();
            }
        }

        return response()->json([
            'status'=> true,
            'message'=>'Project added successfully',
        ]);
    }
}
