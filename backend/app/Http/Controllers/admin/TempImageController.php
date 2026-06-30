<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'image' => 'required|mimes:png,jpg,jpeg,gif'
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'errors'=> $validator->errors('image')
            ]);
        }

        $image = $request->image;

        if(!empty($image)){
            $ext = $image->getClientOriginalExtension();
            $imageName = strtotime('now').'.'.$ext;
            $model = new TempImage();
            $model->name = $imageName;
            $model->save();

            $image->move(public_path('uploads/temp'),$imageName);

            $sourcePath = public_path('uploads/temp/'.$imageName);
            $desPath = public_path('uploads/temp/thumb/'.$imageName);
            $manager = new ImageManager(new Driver());
            $image = $manager->read($sourcePath);
            $image->cover(300, 300);
            $image->toJpeg(90)->save($desPath);

            return response()->json([
                'status'=>true,
                'data'=>$model,
                 'message'=> 'Image Uploaded Successfully'
            ]);

        }


    }
}
